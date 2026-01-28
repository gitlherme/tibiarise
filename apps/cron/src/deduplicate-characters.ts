import { prisma } from "@tibiarise/database";
import "dotenv/config";

const TIBIA_DATA_API_URL =
  process.env.TIBIA_DATA_API_URL || "https://api.tibiadata.com/v4";
const FETCH_TIMEOUT = 30000;
const API_RATE_LIMIT = 5;

interface TibiaDataCharacterResponse {
  character: {
    name: string;
    former_names?: string[];
    former_worlds?: string[];
  };
}

// Rate limiter implementation
class RateLimiter {
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(private limit: number) {}

  async acquire(): Promise<void> {
    if (this.running < this.limit) {
      this.running++;
      return;
    }
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    this.running--;
    const next = this.queue.shift();
    if (next) {
      this.running++;
      next();
    }
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

const MAX_RETRIES = 5;
const RETRY_DELAY_BASE = 2000;
const RETRY_ON_502_DELAY = 10000;
const REQUEST_DELAY_MS = 200; // Delay between successful requests

// Retry helper with exponential backoff & specific 502 handling
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    context?: string;
  } = {},
): Promise<T | null> {
  const {
    maxRetries = MAX_RETRIES,
    initialDelay = RETRY_DELAY_BASE,
    maxDelay = 60000,
    context = "Request",
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Check if it's a 429 or 502 error
      const errorMsg = error instanceof Error ? error.message : String(error);
      const is429 = errorMsg.includes("429");
      const is502 = errorMsg.includes("502");

      if (attempt === maxRetries) {
        console.error(
          `${context} failed after ${maxRetries} retries:`,
          errorMsg,
        );
        return null;
      }

      // Use longer delay for 429/502 errors
      let delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);

      if (is429) delay = Math.max(delay, 5000);
      if (is502) delay = Math.max(delay, RETRY_ON_502_DELAY);

      console.warn(
        `${context} - ${is429 ? "Rate limited (429)" : is502 ? "Bad Gateway (502)" : "Failed"} - Retry ${attempt + 1}/${maxRetries} after ${delay}ms`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return null;
}

const apiLimiter = new RateLimiter(1); // Reduced to 1 concurrent request for safety

async function fetchCharacterDetails(
  name: string,
): Promise<TibiaDataCharacterResponse | null> {
  return fetchWithRetry(
    async () => {
      const response = await fetch(
        `${TIBIA_DATA_API_URL}/character/${encodeURIComponent(name)}`,
        { signal: AbortSignal.timeout(FETCH_TIMEOUT) },
      );

      if (!response.ok) {
        if (response.status === 404) return null; // Not found is not an error to retry unless transient, but usually permanent
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as TibiaDataCharacterResponse;
    },
    { context: `Fetch details for ${name}` },
  );
}

async function mergeCharacters(masterId: string, duplicateId: string) {
  console.log(`Merging duplicate ${duplicateId} into master ${masterId}...`);

  const master = await prisma.character.findUnique({ where: { id: masterId } });
  const duplicate = await prisma.character.findUnique({
    where: { id: duplicateId },
  });

  if (!master || !duplicate) {
    console.warn("One of the characters not found, aborting merge.");
    return;
  }

  // Sum streaks
  const newStreak = (master.streak || 0) + (duplicate.streak || 0);

  // Move DailyExperience
  // Potential issue: Duplicate dates.
  // Strategy: Move all. If application handles duplicates by taking latest/max, we are fine.
  // Given user request "juntando com os existentes", we preserve all history.
  await prisma.dailyExperience.updateMany({
    where: { characterId: duplicateId },
    data: { characterId: masterId },
  });

  // Move ProfitEntry
  await prisma.profitEntry.updateMany({
    where: { characterId: duplicateId },
    data: { characterId: masterId },
  });

  // Move PartyMember
  await prisma.partyMember.updateMany({
    where: { characterId: duplicateId },
    data: { characterId: masterId },
  });

  // Update Master Streak
  await prisma.character.update({
    where: { id: masterId },
    data: { streak: newStreak },
  });

  // Delete duplicate
  await prisma.character.delete({
    where: { id: duplicateId },
  });

  console.log(`Merge complete. New streak: ${newStreak}`);
}

export async function deduplicateCharacters() {
  console.log("Starting Deduplication...");

  // 1. Same Name Duplicates (Should technically be prevented by unique constraint, but good to check)
  // Since 'name' is unique in the schema, we might skip this unless the schema was recently changed.
  // Assuming the user might have bad data from before constraints were enforced or different casing?
  // Prisma checks case sensitivity depending on DB collation.

  // Let's focus on Name Changes (Cross-reference old names)
  console.log("Fetching all characters to check for potential name changes...");
  const allCharacters = await prisma.character.findMany({
    select: { id: true, name: true, formerNames: true },
  });

  console.log(`Found ${allCharacters.length} characters.`);

  let processed = 0;
  for (const char of allCharacters) {
    if (processed % 50 === 0)
      console.log(`Processed ${processed}/${allCharacters.length}`);

    const details = await apiLimiter.run(() =>
      fetchCharacterDetails(char.name),
    );

    // Add small delay to be nice to the API
    await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));

    if (details?.character.former_names) {
      const formerNames = details.character.former_names;

      // Check if any former name exists as a separate record
      const duplicates = await prisma.character.findMany({
        where: {
          name: { in: formerNames },
          id: { not: char.id }, // Don't match self
        },
      });

      if (duplicates.length > 0) {
        console.log(
          `Found duplicates for ${char.name} (Former Names: ${formerNames.join(", ")}):`,
        );
        for (const dup of duplicates) {
          console.log(`- Duplicate ID: ${dup.id}, Name: ${dup.name}`);
          // Merge dup INTO char
          // We need to update char's formerNames to include dup.name if not present
          await mergeCharacters(char.id, dup.id);

          // Update Master's formerNames
          const updatedFormerNames = Array.from(
            new Set([...(char.formerNames || []), ...formerNames]),
          );

          await prisma.character.update({
            where: { id: char.id },
            data: { formerNames: updatedFormerNames },
          });
        }
      }
    }
    processed++;
  }

  console.log("Deduplication logic finished.");
}

// Run standalone
if (require.main === module) {
  deduplicateCharacters()
    .then(() => {
      console.log("Done");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed:", error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
