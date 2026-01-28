import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updatePartySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  maxMembers: z.number().min(2).max(10).optional(),
});

// GET - Get a single party
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const party = await prisma.party.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            character: true,
            user: true,
          },
        },
        creator: true,
      },
    });

    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    return NextResponse.json(serializeBigInt(party));
  } catch (error) {
    console.error("Error fetching party:", error);
    return NextResponse.json(
      { error: "Failed to fetch party" },
      { status: 500 },
    );
  }
}

// PATCH - Update a party
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updateData = updatePartySchema.parse(body);

    const party = await prisma.party.update({
      where: { id },
      data: updateData,
      include: {
        members: true,
        creator: true,
      },
    });

    return NextResponse.json(serializeBigInt(party));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Error updating party:", error);
    return NextResponse.json(
      { error: "Failed to update party" },
      { status: 500 },
    );
  }
}

// DELETE - Remove a party
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.party.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Party deleted" });
  } catch (error) {
    console.error("Error deleting party:", error);
    return NextResponse.json(
      { error: "Failed to delete party" },
      { status: 500 },
    );
  }
}
