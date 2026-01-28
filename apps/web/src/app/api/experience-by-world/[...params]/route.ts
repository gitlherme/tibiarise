import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export interface ExperienceGain {
  characterId: string;
  characterName: string;
  level: number;
  world: string;
  vocation: string | null;
  experienceGained: number;
  experiencePerHour: number;
  percentageGain: number;
}

interface TimePeriod {
  startDate: Date;
  endDate: Date;
  label: string;
}

function getTimePeriods(): {
  yesterday: TimePeriod;
  lastWeek: TimePeriod;
  lastMonth: TimePeriod;
} {
  const today = new Date();
  today.setHours(23, 59, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  monthAgo.setHours(0, 0, 0, 0);

  return {
    yesterday: {
      startDate: yesterday,
      endDate: today,
      label: "daily",
    },
    lastWeek: {
      startDate: weekAgo,
      endDate: today,
      label: "weekly",
    },
    lastMonth: {
      startDate: monthAgo,
      endDate: today,
      label: "monthly",
    },
  };
}

async function calculateExperienceGains(
  world: string,
  startDate: Date,
  endDate: Date,
  limit = 100,
): Promise<ExperienceGain[]> {
  const characters = await prisma.character.findMany({
    where: {
      world: {
        mode: "insensitive",
        equals: world,
      },
    },
    select: {
      id: true,
      name: true,
      level: true,
      vocation: true,
    },
  });

  if (characters.length === 0) {
    return [];
  }

  type CharacterSelect = (typeof characters)[number];
  const characterIds = characters.map((char: CharacterSelect) => char.id);

  const startExperiences = await prisma.dailyExperience.findMany({
    where: {
      characterId: {
        in: characterIds,
      },
      createdAt: {
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    distinct: ["characterId"],
  });

  const endExperiences = await prisma.dailyExperience.findMany({
    where: {
      characterId: {
        in: characterIds,
      },
      createdAt: {
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    distinct: ["characterId"],
  });

  type DailyExp = (typeof startExperiences)[number];

  const startExpMap = new Map<string, DailyExp>(
    startExperiences.map((exp: DailyExp) => [exp.characterId, exp]),
  );
  const endExpMap = new Map<string, DailyExp>(
    endExperiences.map((exp: DailyExp) => [exp.characterId, exp]),
  );
  const characterMap = new Map<string, CharacterSelect>(
    characters.map((char: CharacterSelect) => [char.id, char]),
  );

  const gains: ExperienceGain[] = [];

  for (const characterId of characterIds) {
    const startExp = startExpMap.get(characterId);
    const endExp = endExpMap.get(characterId);
    const character = characterMap.get(characterId);

    if (startExp && endExp && character && startExp.date !== endExp.date) {
      const expGained = Number(
        Number(endExp.value.toString()) - Number(startExp.value.toString()),
      );

      if (expGained <= 0) continue;

      const startDateTime = new Date(startExp.date).getTime();
      const endDateTime = new Date(endExp.date).getTime();
      const daysDiff = (endDateTime - startDateTime) / (1000 * 60 * 60 * 24);

      const hoursDiff = daysDiff * 24;

      const expPerHour =
        hoursDiff > 0 ? Math.round(expGained / hoursDiff) : expGained;

      const percentageGain =
        (expGained / Number(startExp.value.toString())) * 100;

      gains.push({
        characterId,
        characterName: character.name,
        level: endExp.level,
        vocation: character.vocation,
        world,
        experienceGained: expGained,
        experiencePerHour: expPerHour,
        percentageGain: parseFloat(percentageGain.toFixed(2)),
      });
    }
  }

  return gains
    .sort((a, b) => b.experienceGained - a.experienceGained)
    .slice(0, limit);
}

// GET /api/experience-by-world/:world/:period?
// period is optional, defaults to returning all periods
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> },
) {
  const { params: routeParams } = await params;

  if (!routeParams || routeParams.length === 0) {
    return NextResponse.json(
      { error: "World parameter is required" },
      { status: 400 },
    );
  }

  const world = routeParams[0];
  const period = routeParams[1] as "daily" | "weekly" | "monthly" | undefined;
  const limit = 100;

  try {
    const periods = getTimePeriods();

    if (period) {
      let timePeriod: TimePeriod;

      switch (period) {
        case "daily":
          timePeriod = periods.yesterday;
          break;
        case "weekly":
          timePeriod = periods.lastWeek;
          break;
        case "monthly":
          timePeriod = periods.lastMonth;
          break;
        default:
          return NextResponse.json(
            { error: `Invalid period: ${period}` },
            { status: 400 },
          );
      }

      const gains = await calculateExperienceGains(
        world,
        timePeriod.startDate,
        timePeriod.endDate,
        limit,
      );

      return NextResponse.json({
        world,
        period: {
          type: period,
          startDate: timePeriod.startDate,
          endDate: timePeriod.endDate,
        },
        topGainers: gains,
      });
    }

    // Return all periods
    const [yesterdayGains, weeklyGains, monthlyGains] = await Promise.all([
      calculateExperienceGains(
        world,
        periods.yesterday.startDate,
        periods.yesterday.endDate,
        limit,
      ),
      calculateExperienceGains(
        world,
        periods.lastWeek.startDate,
        periods.lastWeek.endDate,
        limit,
      ),
      calculateExperienceGains(
        world,
        periods.lastMonth.startDate,
        periods.lastMonth.endDate,
        limit,
      ),
    ]);

    return NextResponse.json({
      world,
      periods: {
        yesterday: {
          startDate: periods.yesterday.startDate,
          endDate: periods.yesterday.endDate,
          topGainers: yesterdayGains,
        },
        lastWeek: {
          startDate: periods.lastWeek.startDate,
          endDate: periods.lastWeek.endDate,
          topGainers: weeklyGains,
        },
        lastMonth: {
          startDate: periods.lastMonth.startDate,
          endDate: periods.lastMonth.endDate,
          topGainers: monthlyGains,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching experience by world:", error);
    return NextResponse.json(
      { error: "Failed to fetch experience data" },
      { status: 500 },
    );
  }
}
