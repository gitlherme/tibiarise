import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateProfitSchema = z.object({
  huntName: z.string().optional(),
  huntDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  huntDuration: z.number().optional(),
  profit: z.number().optional(),
  preyCardsUsed: z.number().optional(),
  boostsValue: z.number().optional(),
});

function serializeProfitEntry(entry: {
  id: string;
  profit: bigint;
  tibiaCoinValue: bigint;
  netProfit: bigint;
  [key: string]: unknown;
}) {
  return {
    ...entry,
    profit: entry.profit.toString(),
    tibiaCoinValue: entry.tibiaCoinValue.toString(),
    netProfit: entry.netProfit.toString(),
  };
}

// GET - List all profits for a character
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> },
) {
  const { characterId } = await params;

  try {
    const profits = await prisma.profitEntry.findMany({
      where: {
        character: {
          id: characterId,
        },
      },
      orderBy: {
        huntDate: "desc",
      },
    });

    return NextResponse.json(profits.map(serializeProfitEntry));
  } catch (error) {
    console.error("Error fetching profit entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch profit entries" },
      { status: 500 },
    );
  }
}

// PATCH - Update a profit entry
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> },
) {
  const { characterId: id } = await params;

  try {
    const body = await request.json();
    const updateData = updateProfitSchema.parse(body);

    const profitEntry = await prisma.profitEntry.update({
      where: { id },
      data: {
        ...updateData,
        profit: updateData.profit ? BigInt(updateData.profit) : undefined,
      },
    });

    return NextResponse.json(serializeProfitEntry(profitEntry));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Error updating profit entry:", error);
    return NextResponse.json(
      { error: "Failed to update profit entry" },
      { status: 500 },
    );
  }
}

// DELETE - Remove a profit entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> },
) {
  const { characterId: id } = await params;

  try {
    await prisma.profitEntry.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Profit entry deleted" });
  } catch (error) {
    console.error("Error deleting profit entry:", error);
    return NextResponse.json(
      { error: "Failed to delete profit entry" },
      { status: 500 },
    );
  }
}
