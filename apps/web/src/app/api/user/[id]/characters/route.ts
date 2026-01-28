import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const characters = await prisma.character.findMany({
      where: {
        user: {
          email: id,
        },
      },
    });

    return NextResponse.json(serializeBigInt(characters));
  } catch (error) {
    console.error("Error fetching user characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch user characters" },
      { status: 500 },
    );
  }
}
