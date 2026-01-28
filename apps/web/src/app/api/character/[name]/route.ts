import { prisma } from "@/lib/db";
import {
  TibiaDataCharacter,
  TibiaDataCharacterEndpoint,
} from "@/models/tibia-data.model";
import { DailyExperience } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const TIBIA_DATA_API_URL =
  process.env.TIBIA_DATA_API_URL || "https://api.tibiadata.com/v4";

function mapExperienceTable(experienceTable: DailyExperience[]) {
  return experienceTable
    .map((day, index) => {
      if (index !== 0) {
        if (experienceTable[index - 1].value! !== day.value!) {
          return {
            experience:
              Number(day.value.toString()) -
              Number(experienceTable[index - 1].value!.toString()),
            totalExperience: Number(day.value.toString()),
            date: day.date,
            level: day.level,
          };
        }

        return {
          experience: 0,
          totalExperience: Number(day.value.toString()),
          date: day.date,
          level: day.level,
        };
      }
      return undefined;
    })
    .filter((day) => day !== undefined && day !== null)
    .reverse();
}

function mapCharacterOutput(
  character: TibiaDataCharacter,
  experienceTable: DailyExperience[],
  isVerified: boolean = false,
  verifiedAt: Date | null = null,
  streak: number = 0,
) {
  const experienceTableOutput = mapExperienceTable(experienceTable);

  return {
    character: {
      name: character.character.name,
      level: character.character.level,
      world: character.character.world,
      vocation: character.character.vocation,
      sex: character.character.sex,
      streak,
      isVerified,
      verifiedAt,
      guild: {
        name: character.character.guild?.name ?? "",
        rank: character.character.guild?.rank ?? "",
      },
    },
    experienceTable: experienceTableOutput,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;

  try {
    const character = await prisma.character.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
      include: {
        profitHistory: false,
      },
    });

    if (!character) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 },
      );
    }

    const characterDailyExperienceTable = await prisma.dailyExperience.findMany(
      {
        where: {
          characterId: character.id,
        },
        orderBy: {
          date: "asc",
        },
      },
    );

    const response = await fetch(`${TIBIA_DATA_API_URL}/character/${name}`);
    const characterDataResponse: TibiaDataCharacterEndpoint =
      await response.json();

    const isVerified = character.verified ?? false;
    if (characterDataResponse && characterDailyExperienceTable) {
      return NextResponse.json(
        mapCharacterOutput(
          characterDataResponse.character,
          characterDailyExperienceTable,
          isVerified,
          character.verifiedAt,
          character.streak,
        ),
      );
    }

    return NextResponse.json({});
  } catch (error) {
    console.error("Error fetching character:", error);
    return NextResponse.json(
      { error: "Failed to fetch character" },
      { status: 500 },
    );
  }
}
