"use server";

import { prisma } from "@/lib/db";

export async function getHomeStats() {
  try {
    // 1. Get Top 3 Gainers from Yesterday
    // Fetch distinct days (Left 10 chars = YYYY-MM-DD) to compare
    const distinctDays = await prisma.$queryRaw<{ day: string }[]>`
      SELECT DISTINCT SUBSTRING("date", 1, 10) as day
      FROM "DailyExperience"
      ORDER BY day DESC
      LIMIT 2;
    `;

    let topGainers: any[] = [];

    if (distinctDays.length >= 2) {
      const latestDay = distinctDays[0].day;
      const previousDay = distinctDays[1].day;

      // Match any record that starts with the day string (YYYY-MM-DD)
      const latestDayPattern = `${latestDay}%`;
      const previousDayPattern = `${previousDay}%`;

      // Note: We use LIKE to match timestamps starting with '2026-01-26' irrespective of time.
      // We select the one with highest value to be safe (max) in case of duplicates,
      // or just join. Assuming one entry per day per char usually.
      // If duplicates exist, we should probably take MAX(value) or MAX(date).
      // Let's assume unique constraint or just take one via simple join.
      // Actually, to be safer against duplicates, we could use subqueries but that's expensive.
      // Given current data structure, simpel join on date prefix works.

      // Use Prisma raw query with parameter substitution for safety
      const result: any[] = await prisma.$queryRaw`
            SELECT 
                c.id,
                c.name as "characterName", 
                (d1.value - d2.value) as "value",
                d1.level
            FROM "DailyExperience" d1
            JOIN "DailyExperience" d2 ON d1."characterId" = d2."characterId"
            JOIN "Character" c ON d1."characterId" = c.id
            WHERE d1.date LIKE ${latestDayPattern}
              AND d2.date LIKE ${previousDayPattern}
            ORDER BY "value" DESC
            LIMIT 3;
        `;
      topGainers = result;
    }

    // 2. Highest Level
    const topLevelChar = await prisma.character.findFirst({
      orderBy: { level: "desc" },
    });

    // 3. Total Community Characters
    const totalCharacters = await prisma.character.count();

    // 4. Recent Profit/Hunts
    const recentHunts = await prisma.profitEntry.findMany({
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        character: {
          user: {
            showProfitOnHome: true,
          },
        },
      },
      include: {
        character: {
          select: {
            name: true,
            vocation: true,
            level: true,
          },
        },
      },
    });

    const totalProfit = await prisma.profitEntry.aggregate({
      _sum: {
        netProfit: true,
      },
    });

    return {
      topGainers: topGainers.map((g) => ({
        id: g.id,
        characterName: g.characterName,
        value: Number(g.value),
        level: g.level,
      })),
      topLevel: topLevelChar
        ? {
            characterName: topLevelChar.name,
            level: topLevelChar.level,
            vocation: topLevelChar.vocation || "Unknown",
          }
        : null,
      totalCharacters,
      recentHunts: recentHunts.map((hunt) => ({
        id: hunt.id,
        characterName: hunt.character.name,
        huntName: hunt.huntName || "Unknown Hunt",
        profit: Number(hunt.netProfit),
        timeAgo: hunt.createdAt, // We will handle formatting in the frontend or here
      })),
      totalProfit: Number(totalProfit._sum.netProfit || 0),
    };
  } catch (error) {
    console.error("Error fetching home stats:", error);
    return {
      topGainers: [],
      topLevel: null,
      totalCharacters: 0,
      recentHunts: [],
      totalProfit: 0,
    };
  }
}
