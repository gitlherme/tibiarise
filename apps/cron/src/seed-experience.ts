import { prisma } from "@tibiarise/database";
import "dotenv/config";

const TIBIA_DATA_API_URL =
  process.env.TIBIA_DATA_API_URL || "https://api.tibiadata.com/v4";

// Optimized constants
const BATCH_SIZE = 500;
const TOTAL_PAGES = 20;
const CONCURRENT_WORLDS = 2; // Reduced to avoid rate limiting
const API_RATE_LIMIT = 3; // Max concurrent API requests (reduced to avoid 429)
const REQUEST_DELAY_MS = 200; // Delay between requests in ms
const FETCH_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_ON_429_DELAY = 5000; // 5 seconds delay on 429 error

interface HighscoreList {
  level: number;
  name: string;
  rank: number;
  title: string;
  value: number;
  vocation: string;
  world: string;
}

interface Highscores {
  highscores: {
    category: string;
    highscore_age: number;
    highscore_list: HighscoreList[];
    vocation: string;
    world: string;
  };
}

interface WorldsApiResponse {
  worlds: {
    regular_worlds: { name: string }[];
  };
}

interface TibiaDataCharacterResponse {
  character: {
    name: string;
    former_names?: string[];
    former_worlds?: string[];
  };
}

interface ProcessingStats {
  worldsProcessed: number;
  worldsTotal: number;
  worldsFailed: number;
  charactersCreated: number;
  charactersUpdated: number;
  dailyExperiencesCreated: number;
  errors: Array<{ world: string; error: string }>;
  startTime: number;
}

function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function getDateOnly(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Retry helper with exponential backoff
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
    initialDelay = 1000,
    maxDelay = 10000,
    context = "Request",
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Check if it's a 429 error
      const is429 = error instanceof Error && error.message.includes("429");

      if (attempt === maxRetries) {
        console.error(
          `${context} failed after ${maxRetries} retries:`,
          error instanceof Error ? error.message : error,
        );
        return null;
      }

      // Use longer delay for 429 errors
      const delay = is429
        ? RETRY_ON_429_DELAY
        : Math.min(initialDelay * Math.pow(2, attempt), maxDelay);

      console.warn(
        `${context} - ${is429 ? "Rate limited (429)" : "Failed"} - Retry ${attempt + 1}/${maxRetries} after ${delay}ms`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return null;
}

// Rate limiter implementation (simple semaphore)
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

const apiLimiter = new RateLimiter(API_RATE_LIMIT);

async function fetchHighscorePage(
  page: number,
  world: string,
): Promise<HighscoreList[]> {
  const result = await fetchWithRetry(
    async () => {
      const response = await fetch(
        `${TIBIA_DATA_API_URL}/highscores/${world}/experience/all/${page}`,
        { signal: AbortSignal.timeout(FETCH_TIMEOUT) },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as Highscores;
      return data.highscores.highscore_list;
    },
    { context: `Fetch highscore page ${page} for ${world}` },
  );

  return result || [];
}

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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as TibiaDataCharacterResponse;
    },
    { context: `Fetch details for ${name}` },
  );
}

async function getAllWorlds(): Promise<string[]> {
  const result = await fetchWithRetry(
    async () => {
      const response = await fetch(`${TIBIA_DATA_API_URL}/worlds`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as WorldsApiResponse;
      return data.worlds.regular_worlds.map((world) => world.name);
    },
    { context: "Fetch worlds list" },
  );

  return result || [];
}

async function processWorld(
  world: string,
  stats: ProcessingStats,
): Promise<void> {
  const startTime = Date.now();
  try {
    console.log(`[${world}] Starting processing...`);

    // Fetch all pages with rate limiting and delays
    const results: PromiseSettledResult<HighscoreList[]>[] = [];

    // Process in smaller batches with delays to avoid rate limiting
    const PAGES_PER_BATCH = 5;
    for (
      let batchStart = 0;
      batchStart < TOTAL_PAGES;
      batchStart += PAGES_PER_BATCH
    ) {
      const batchEnd = Math.min(batchStart + PAGES_PER_BATCH, TOTAL_PAGES);
      const batchPromises = Array.from(
        { length: batchEnd - batchStart },
        (_, i) =>
          apiLimiter.run(() => fetchHighscorePage(batchStart + i + 1, world)),
      );

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);

      // Add delay between batches (except for last batch)
      if (batchEnd < TOTAL_PAGES) {
        await new Promise((resolve) =>
          setTimeout(resolve, REQUEST_DELAY_MS * 2),
        );
      }
    }
    const allHighscores: HighscoreList[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allHighscores.push(...result.value);
      } else {
        console.warn(
          `[${world}] Failed to fetch page ${index + 1}: ${result.reason}`,
        );
      }
    });

    if (allHighscores.length === 0) {
      console.warn(`[${world}] No highscores data found`);
      stats.worldsFailed++;
      stats.errors.push({
        world,
        error: "No highscores data retrieved",
      });
      return;
    }

    const uniqueHighscores = Array.from(
      new Map(allHighscores.map((item) => [item.name, item])).values(),
    );

    console.log(
      `[${world}] Fetched ${uniqueHighscores.length} unique characters`,
    );

    const today = new Date();
    const todayDateOnly = getDateOnly(today);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateOnly = getDateOnly(yesterday);

    const todayRecordsCount = await prisma.dailyExperience.count({
      where: {
        character: { world },
        date: { startsWith: todayDateOnly },
      },
    });

    if (todayRecordsCount > 0) {
      console.log(`[${world}] Already processed today, skipping`);
      return;
    }

    const names = uniqueHighscores.map((h) => h.name);
    const existingCharacters = await prisma.character.findMany({
      where: { name: { in: names } },
      select: {
        id: true,
        name: true,
        streak: true,
        experience: true,
        vocation: true,
        world: true,
        formerWorlds: true,
        formerNames: true,
      },
    });

    type ExistingChar = (typeof existingCharacters)[number];
    const characterByName = new Map<string, ExistingChar>(
      existingCharacters.map((c: ExistingChar) => [c.name, c]),
    );

    const yesterdayExperiences = await prisma.dailyExperience.findMany({
      where: {
        character: { world },
        date: { startsWith: yesterdayDateOnly },
      },
      select: { characterId: true, value: true },
    });

    type YesterdayExp = (typeof yesterdayExperiences)[number];
    const yesterdayExpMap = new Map<string, bigint>(
      yesterdayExperiences.map((exp: YesterdayExp) => [
        exp.characterId,
        exp.value,
      ]),
    );

    const newCharacters: {
      name: string;
      world: string;
      level: number;
      experience: bigint;
      streak: number;
      vocation: string | null;
      createdAt: Date;
    }[] = [];

    const newDailyExperiences: {
      characterId: string;
      date: string;
      value: bigint;
      level: number;
    }[] = [];

    const characterUpdates: {
      id: string;
      updates: {
        streak: number;
        experience?: bigint;
        level?: number;
        world?: string;
        name?: string;
        formerWorlds?: string[];
        formerNames?: string[];
      };
    }[] = [];

    const currentTimestamp = new Date().toISOString();

    for (const data of uniqueHighscores) {
      let existingChar = characterByName.get(data.name);

      // Check for Name Change if not found
      if (!existingChar) {
        try {
          const details = await apiLimiter.run(() =>
            fetchCharacterDetails(data.name),
          );

          if (details?.character.former_names) {
            // Check if any former name exists in our DB
            const formerNameMatches = await prisma.character.findMany({
              where: { name: { in: details.character.former_names } },
              select: {
                id: true,
                name: true,
                streak: true,
                experience: true,
                vocation: true,
                world: true,
                formerWorlds: true,
                formerNames: true,
              },
            });

            if (formerNameMatches.length > 0) {
              // Found a match! This is a rename.
              // Pick the most relevant one (technically should be only one active, but handle list)
              existingChar = formerNameMatches[0];

              console.log(
                `[${world}] Detected name change: ${existingChar.name} -> ${data.name}`,
              );

              // Prepare rename update immediately or part of standard update?
              // We need to treat this char as "existing" now, but with pending updates.
              // We will let the standard logic handle the updates, but we need to inject the rename fields.
            }
          }
        } catch (err) {
          console.warn(
            `[${world}] Failed to check details for potential new char ${data.name}`,
            err,
          );
        }
      }

      if (!existingChar) {
        const newChar = {
          name: data.name,
          world,
          level: data.level,
          experience: BigInt(data.value),
          streak: 1,
          vocation: data.vocation || null,
          createdAt: new Date(),
        };
        newCharacters.push(newChar);
      } else {
        const characterId = existingChar.id;
        let currentStreak = existingChar.streak || 0;

        const yesterdayExp = yesterdayExpMap.get(characterId);
        const expChanged = BigInt(data.value) !== existingChar.experience;

        // Calculate XP gained today
        let xpGainedToday = BigInt(0);
        if (yesterdayExp !== undefined) {
          // XP gained = today's total XP - yesterday's total XP
          xpGainedToday = BigInt(data.value) - yesterdayExp;
        } else {
          // No yesterday record, use total XP as gained
          xpGainedToday = BigInt(data.value);
        }

        // Streak logic:
        if (xpGainedToday === BigInt(0)) {
          currentStreak = 0;
        } else {
          if (yesterdayExp !== undefined) {
            currentStreak += 1;
          } else {
            currentStreak = 1;
          }
        }

        const worldChanged = existingChar.world !== world;
        const nameChanged = existingChar.name !== data.name;
        const vocationChanged =
          existingChar.vocation !== data.vocation && data.vocation;

        if (
          expChanged ||
          existingChar.streak !== currentStreak ||
          worldChanged ||
          nameChanged ||
          vocationChanged
        ) {
          const updates: {
            streak: number;
            experience?: bigint;
            level?: number;
            world?: string;
            formerWorlds?: string[];
            name?: string;
            formerNames?: string[];
            vocation?: string;
          } = {
            streak: currentStreak,
          };

          if (vocationChanged) {
            updates.vocation = data.vocation;
          }

          if (expChanged) {
            updates.experience = BigInt(data.value);
            updates.level = data.level;
          }

          if (worldChanged) {
            console.log(
              `[${world}] Detected world change for ${existingChar.name}: ${existingChar.world} -> ${world}`,
            );
            updates.world = world;
            updates.formerWorlds = [
              ...(existingChar.formerWorlds || []),
              existingChar.world,
            ];
          }

          if (nameChanged) {
            updates.name = data.name;
            updates.formerNames = [
              ...(existingChar.formerNames || []),
              existingChar.name,
            ];
          }

          characterUpdates.push({
            id: characterId,
            updates,
          });
        }

        newDailyExperiences.push({
          characterId,
          date: currentTimestamp,
          value: BigInt(data.value),
          level: data.level,
        });
      }
    }

    // Insert new characters in batches
    if (newCharacters.length > 0) {
      console.log(`[${world}] Creating ${newCharacters.length} new characters`);
      const characterChunks = chunk(newCharacters, BATCH_SIZE);

      for (const batch of characterChunks) {
        await prisma.character.createMany({
          data: batch,
          skipDuplicates: true,
        });
      }

      stats.charactersCreated += newCharacters.length;

      // Fetch IDs for newly created characters
      const newCharacterNames = newCharacters.map((c) => c.name);
      const createdCharacters = await prisma.character.findMany({
        where: {
          name: { in: newCharacterNames },
          world,
        },
        select: { id: true, name: true },
      });

      type CreatedChar = (typeof createdCharacters)[number];
      const newCharacterDailies = createdCharacters.map((c: CreatedChar) => ({
        characterId: c.id,
        date: currentTimestamp,
        value:
          newCharacters.find((nc) => nc.name === c.name)?.experience ||
          BigInt(0),
        level: newCharacters.find((nc) => nc.name === c.name)?.level || 1,
      }));

      newDailyExperiences.push(...newCharacterDailies);
    }

    // Batch update characters with controlled concurrency
    if (characterUpdates.length > 0) {
      console.log(`[${world}] Updating ${characterUpdates.length} characters`);

      // Smaller batches to avoid timeout - 100 concurrent updates at a time
      const UPDATE_BATCH_SIZE = 100;
      const updateChunks = chunk(characterUpdates, UPDATE_BATCH_SIZE);

      for (const batch of updateChunks) {
        // Use Promise.allSettled to continue even if some updates fail
        const results = await Promise.allSettled(
          batch.map((u) =>
            prisma.character.update({
              where: { id: u.id },
              data: u.updates,
            }),
          ),
        );

        // Count successes and failures
        const succeeded = results.filter(
          (r) => r.status === "fulfilled",
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;

        if (failed > 0) {
          console.warn(
            `[${world}] Batch update: ${succeeded} succeeded, ${failed} failed`,
          );
        }

        stats.charactersUpdated += succeeded;
      }
    }

    // Insert daily experiences in batches
    if (newDailyExperiences.length > 0) {
      console.log(
        `[${world}] Creating ${newDailyExperiences.length} daily experience records`,
      );
      const dailyChunks = chunk(newDailyExperiences, BATCH_SIZE);

      for (const batch of dailyChunks) {
        await prisma.dailyExperience.createMany({
          data: batch,
          skipDuplicates: true,
        });
      }

      stats.dailyExperiencesCreated += newDailyExperiences.length;
    }

    const executionTime = (Date.now() - startTime) / 1000;
    console.log(
      `[${world}] ✓ Completed in ${executionTime.toFixed(2)}s - ${newCharacters.length} new, ${characterUpdates.length} updated, ${newDailyExperiences.length} daily records`,
    );

    stats.worldsProcessed++;
  } catch (error) {
    console.error(`[${world}] ✗ Failed:`, error);
    stats.worldsFailed++;
    stats.errors.push({
      world,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function seedPlayersExperience(): Promise<{
  success: boolean;
  message: string;
  executionTime: number;
  stats: ProcessingStats;
}> {
  console.log("Starting seedPlayersExperience job");
  const startTime = Date.now();

  const stats: ProcessingStats = {
    worldsProcessed: 0,
    worldsTotal: 0,
    worldsFailed: 0,
    charactersCreated: 0,
    charactersUpdated: 0,
    dailyExperiencesCreated: 0,
    errors: [],
    startTime,
  };

  const worlds = await getAllWorlds();

  if (worlds.length === 0) {
    return {
      success: false,
      message: "Failed to fetch worlds",
      executionTime: (Date.now() - startTime) / 1000,
      stats,
    };
  }

  stats.worldsTotal = worlds.length;
  console.log(`Processing ${worlds.length} worlds...`);

  const worldChunks = chunk(worlds, CONCURRENT_WORLDS);

  for (const worldBatch of worldChunks) {
    await Promise.all(worldBatch.map((world) => processWorld(world, stats)));
  }

  const executionTime = (Date.now() - startTime) / 1000;

  const summary = `Processed ${stats.worldsProcessed}/${stats.worldsTotal} worlds in ${executionTime.toFixed(2)}s - Created: ${stats.charactersCreated} chars, Updated: ${stats.charactersUpdated} chars, Daily exp: ${stats.dailyExperiencesCreated}`;

  console.log(summary);

  if (stats.worldsFailed > 0) {
    console.warn(`${stats.worldsFailed} worlds failed. Errors:`, stats.errors);
  }

  return {
    success: stats.worldsFailed === 0,
    message: summary,
    executionTime,
    stats,
  };
}

// Run standalone
if (require.main === module) {
  seedPlayersExperience()
    .then((result) => {
      console.log("Job completed:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Job failed:", error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
