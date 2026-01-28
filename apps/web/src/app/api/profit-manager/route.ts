import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface PriceData {
  world_name: string;
  buy_average_price: number;
  buy_highest_price: number;
  sell_lowest_price: number;
  sell_average_price: number;
  created_at: string;
}

interface Prices {
  prices: PriceData[];
}

const createProfitSchema = z.object({
  huntName: z.string(),
  huntDate: z.string().transform((val) => new Date(val)),
  huntDuration: z.number().optional(),
  profit: z.number(),
  preyCardsUsed: z.number(),
  boostsValue: z.number(),
  world: z.string(),
  characterId: z.string(),
  userId: z.string(),
});

async function getTibiaCoinValue(world: string): Promise<number | null> {
  try {
    const response = await fetch("https://tibiatrade.gg/api/tibiaCoinPrices");
    const data: Prices = await response.json();

    const worldPrices = data.prices.find(
      (price) => price.world_name.toLowerCase() === world.toLowerCase(),
    );

    return worldPrices ? worldPrices.sell_average_price : null;
  } catch (error) {
    console.error("Error fetching Tibia Coin values:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      huntName,
      huntDate,
      huntDuration,
      profit,
      preyCardsUsed,
      boostsValue,
      world,
      characterId,
      userId,
    } = createProfitSchema.parse(body);

    const tibiaCoinValue = await getTibiaCoinValue(world);

    const character = await prisma.character.findUnique({
      where: { id: characterId, userId },
    });

    if (!character) {
      return NextResponse.json(
        {
          error: `Character with ID ${characterId} for user ${userId} not found`,
        },
        { status: 404 },
      );
    }

    const tcValue = tibiaCoinValue ?? 0;
    const totalPrey = preyCardsUsed * (tcValue * 10);
    const totalBoosts = boostsValue * tcValue;

    const profitEntry = await prisma.profitEntry.create({
      data: {
        huntName,
        huntDate,
        profit: BigInt(profit),
        huntDuration,
        preyCardsUsed: totalPrey,
        boostsValue: totalBoosts,
        tibiaCoinValue: BigInt(tcValue),
        netProfit: BigInt(profit - (totalPrey + totalBoosts)),
        character: {
          connect: { id: characterId },
        },
      },
    });

    return NextResponse.json(
      {
        ...profitEntry,
        profit: profitEntry.profit.toString(),
        tibiaCoinValue: profitEntry.tibiaCoinValue.toString(),
        netProfit: profitEntry.netProfit.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Error creating profit entry:", error);
    return NextResponse.json(
      { error: "Failed to create profit entry" },
      { status: 500 },
    );
  }
}
