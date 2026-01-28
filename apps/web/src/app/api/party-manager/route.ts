import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createPartySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  createdBy: z.string(),
  maxMembers: z.number().min(2).max(10).optional().default(5),
});

// GET - List all parties
export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      include: {
        members: {
          include: {
            character: true,
            user: true,
          },
        },
        creator: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(serializeBigInt(parties));
  } catch (error) {
    console.error("Error fetching parties:", error);
    return NextResponse.json(
      { error: "Failed to fetch parties" },
      { status: 500 },
    );
  }
}

// POST - Create a new party
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, createdBy, maxMembers } =
      createPartySchema.parse(body);

    const party = await prisma.party.create({
      data: {
        name,
        description,
        createdBy,
        maxMembers,
      },
      include: {
        creator: true,
      },
    });

    return NextResponse.json(serializeBigInt(party), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Error creating party:", error);
    return NextResponse.json(
      { error: "Failed to create party" },
      { status: 500 },
    );
  }
}
