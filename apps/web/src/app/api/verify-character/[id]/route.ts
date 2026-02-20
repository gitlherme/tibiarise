import { prisma } from "@/lib/db";
import { TibiaDataCharacterEndpoint } from "@/models/tibia-data.model";
import { levelExperience } from "@/utils/level-formulae";
import { NextRequest, NextResponse } from "next/server";

const TIBIA_DATA_API_URL =
  process.env.TIBIA_DATA_API_URL || "https://api.tibiadata.com/v4";

// GET - Find verification by code or character name
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    // First try by verification code
    let verification = await prisma.verifyCharacter.findFirst({
      where: {
        verificationCode: id,
      },
    });

    // If not found, try by character name
    if (!verification) {
      verification = await prisma.verifyCharacter.findFirst({
        where: {
          characterName: {
            equals: id,
            mode: "insensitive",
          },
        },
      });
    }

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ code: verification.verificationCode });
  } catch (error) {
    console.error("Error fetching verification:", error);
    return NextResponse.json(
      { error: "Failed to fetch verification" },
      { status: 500 },
    );
  }
}

// PUT - Validate verification code (check character comment)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const verification = await prisma.verifyCharacter.findFirst({
      where: {
        verificationCode: id,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 },
      );
    }

    // Fetch character data from TibiaData API
    const response = await fetch(
      `${TIBIA_DATA_API_URL}/character/${encodeURIComponent(
        verification.characterName,
      )}`,
    );

    if (!response.ok) {
      throw new Error(`TibiaData API returned ${response.status}`);
    }

    const data: TibiaDataCharacterEndpoint = await response.json();

    if (!data.character || !data.character.character) {
      return NextResponse.json(
        { error: "Character not found on TibiaData" },
        { status: 404 },
      );
    }

    const characterData = data.character.character;
    const comment = characterData.comment || "";
    const commentHasCode = comment.toLowerCase().includes(id.toLowerCase());

    if (!commentHasCode) {
      console.error(`Comment does not contain verification code
        - Character: ${verification.characterName}
        - Current comment: ${comment}
        - Verification code: ${id}  
      `);
      return NextResponse.json(
        { error: "Comment does not contain verification code" },
        { status: 401 },
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: {
        email: verification.userId,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: verification.userId,
        },
      });
    }

    // Check if character exists in database
    const characterExists = await prisma.character.findFirst({
      where: {
        name: {
          equals: verification.characterName,
          mode: "insensitive",
        },
      },
    });

    if (characterExists) {
      // Update existing character as verified
      await prisma.character.update({
        where: {
          id: characterExists.id,
        },
        data: {
          verified: true,
          verifiedAt: new Date(),
          userId: user.id,
          vocation: characterData.vocation,
          level: characterData.level,
          experience: BigInt(levelExperience(characterData.level)),
          world: characterData.world,
        },
      });
    } else {
      // Create character if it doesn't exist
      await prisma.character.create({
        data: {
          name: characterData.name,
          world: characterData.world,
          level: characterData.level,
          vocation: characterData.vocation,
          experience: BigInt(levelExperience(characterData.level)),
          verified: true,
          verifiedAt: new Date(),
          userId: user.id,
        },
      });
    }

    // Remove verification record
    await prisma.verifyCharacter.delete({
      where: {
        id: verification.id,
      },
    });

    return NextResponse.json({
      message: "Verification code accepted. Character verified.",
    });
  } catch (error) {
    console.error("Error validating verification:", error);
    return NextResponse.json(
      { error: "Failed to validate verification" },
      { status: 500 },
    );
  }
}

// DELETE - Remove verification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.verifyCharacter.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Verification deleted" });
  } catch (error) {
    console.error("Error deleting verification:", error);
    return NextResponse.json(
      { error: "Failed to delete verification" },
      { status: 500 },
    );
  }
}
