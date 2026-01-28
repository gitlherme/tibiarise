"use server";

import { auth } from "@/auth";
import { Character } from "@/components/dashboard/character-grid";
import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";

export async function getUserCharacters(): Promise<Character[]> {
  const session = await auth();

  if (!session?.user?.email) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return [];
  }

  const characters = await prisma.character.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return serializeBigInt(characters) as unknown as Character[];
}
