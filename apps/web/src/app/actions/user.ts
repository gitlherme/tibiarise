"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleShowProfitOnHome(currentState: boolean) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const newState = !currentState;

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      showProfitOnHome: newState,
    },
  });

  revalidatePath("/");
  return newState;
}

export async function getUserSettings() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      showProfitOnHome: true,
    },
  });

  return user;
}
