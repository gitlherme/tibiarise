import "dotenv/config";
import { deleteOldExperience } from "./delete-old-experience";
import { seedPlayersExperience } from "./seed-experience";

async function main() {
  const args = process.argv.slice(2);
  const job = args[0] || "seed"; // Default to seed job

  console.log(`Running job: ${job}`);
  console.log("=".repeat(50));

  try {
    switch (job) {
      case "seed":
        const seedResult = await seedPlayersExperience();
        console.log("=".repeat(50));
        console.log("Seed job result:", seedResult);
        process.exit(seedResult.success ? 0 : 1);
        break;

      case "cleanup":
        const cleanupResult = await deleteOldExperience();
        console.log("=".repeat(50));
        console.log("Cleanup job result:", cleanupResult);
        process.exit(cleanupResult.success ? 0 : 1);
        break;

      case "all":
        // Run both jobs
        console.log("Running seed job...");
        const seed = await seedPlayersExperience();
        console.log("Seed result:", seed);

        console.log("\nRunning cleanup job...");
        const cleanup = await deleteOldExperience();
        console.log("Cleanup result:", cleanup);

        const success = seed.success && cleanup.success;
        process.exit(success ? 0 : 1);
        break;

      default:
        console.error(`Unknown job: ${job}`);
        console.log("Available jobs: seed, cleanup, all");
        process.exit(1);
    }
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main();
