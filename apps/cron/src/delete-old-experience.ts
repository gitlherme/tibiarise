import { prisma } from "@tibiarise/database";
import "dotenv/config";

// Configuration
const DAYS_TO_KEEP = 365; // Keep 1 year of data
const BATCH_SIZE = 1000; // Delete in batches to avoid long-running transactions

export async function deleteOldExperience(): Promise<{
  success: boolean;
  message: string;
  recordsDeleted: number;
  executionTime: number;
}> {
  console.log("Starting deleteOldExperience job");
  const startTime = Date.now();

  try {
    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_KEEP);
    const cutoffDateStr = cutoffDate.toISOString();

    console.log(
      `Deleting daily experience records older than ${cutoffDateStr} (${DAYS_TO_KEEP} days ago)`,
    );

    // Count records to delete
    const recordsToDelete = await prisma.dailyExperience.count({
      where: {
        date: {
          lt: cutoffDateStr,
        },
      },
    });

    console.log(`Found ${recordsToDelete} old records to delete`);

    if (recordsToDelete === 0) {
      const executionTime = (Date.now() - startTime) / 1000;
      return {
        success: true,
        message: "No old records to delete",
        recordsDeleted: 0,
        executionTime,
      };
    }

    // Delete in batches
    let totalDeleted = 0;
    let batchCount = 0;

    while (true) {
      const result = await prisma.dailyExperience.deleteMany({
        where: {
          date: {
            lt: cutoffDateStr,
          },
        },
        // Note: Prisma doesn't support LIMIT in deleteMany, so we'll delete all at once
        // If this becomes an issue, we can switch to findMany + delete in loops
      });

      totalDeleted += result.count;
      batchCount++;

      console.log(
        `Batch ${batchCount}: Deleted ${result.count} records (Total: ${totalDeleted})`,
      );

      // If we deleted less than BATCH_SIZE, we're done
      if (result.count === 0) {
        break;
      }
    }

    const executionTime = (Date.now() - startTime) / 1000;
    const message = `Successfully deleted ${totalDeleted} old daily experience records in ${executionTime.toFixed(2)}s`;

    console.log(message);

    return {
      success: true,
      message,
      recordsDeleted: totalDeleted,
      executionTime,
    };
  } catch (error) {
    const executionTime = (Date.now() - startTime) / 1000;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("Delete old experience job failed:", errorMessage);

    return {
      success: false,
      message: `Failed to delete old records: ${errorMessage}`,
      recordsDeleted: 0,
      executionTime,
    };
  }
}

// Run standalone
if (require.main === module) {
  deleteOldExperience()
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
