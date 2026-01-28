import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const createVerifyCharacterSchema = z.object({
  characterName: z.string().min(1),
  userId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterName, userId } = createVerifyCharacterSchema.parse(body);

    const verification = await prisma.verifyCharacter.create({
      data: {
        characterName,
        userId,
        verificationCode: randomUUID(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      },
    });

    return NextResponse.json(
      { code: verification.verificationCode },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Error creating verification:", error);
    return NextResponse.json(
      { error: "Failed to create verification" },
      { status: 500 },
    );
  }
}
