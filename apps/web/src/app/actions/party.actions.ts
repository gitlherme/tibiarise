"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { signInviteToken, verifyInviteToken } from "@/lib/jwt";
import { serializeBigInt } from "@/lib/serialize";
import { revalidatePath } from "next/cache";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  return user;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// ─── Party CRUD ─────────────────────────────────────────────────────────────

export async function createParty(data: {
  name: string;
  description?: string;
  characterId: string;
}) {
  const user = await getAuthenticatedUser();

  const party = await prisma.party.create({
    data: {
      name: data.name,
      description: data.description,
      createdBy: user.id,
      slug: slugify(data.name),
      members: {
        create: {
          userId: user.id,
          characterId: data.characterId,
          isLeader: true,
        },
      },
    },
    include: {
      members: { include: { character: true } },
    },
  });

  revalidatePath("/dashboard/party");
  return serializeBigInt(party);
}

export async function updateParty(
  partyId: string,
  data: { name?: string; description?: string },
) {
  const user = await getAuthenticatedUser();

  const party = await prisma.party.findUnique({ where: { id: partyId } });
  if (!party || party.createdBy !== user.id) throw new Error("Forbidden");

  const updateData: Record<string, unknown> = { ...data };
  if (data.name) {
    updateData.slug = slugify(data.name);
  }

  const updated = await prisma.party.update({
    where: { id: partyId },
    data: updateData,
  });

  revalidatePath("/dashboard/party");
  return serializeBigInt(updated);
}

export async function deleteParty(partyId: string) {
  const user = await getAuthenticatedUser();

  const party = await prisma.party.findUnique({ where: { id: partyId } });
  if (!party || party.createdBy !== user.id) throw new Error("Forbidden");

  await prisma.party.update({
    where: { id: partyId },
    data: { isActive: false },
  });

  revalidatePath("/dashboard/party");
  return { success: true };
}

// ─── Invite Flow ────────────────────────────────────────────────────────────

export async function getInviteLink(partyId: string) {
  const user = await getAuthenticatedUser();

  const party = await prisma.party.findUnique({ where: { id: partyId } });
  if (!party || party.createdBy !== user.id) throw new Error("Forbidden");

  const token = await signInviteToken(party.id);
  return { inviteCode: token };
}

export async function acceptInvite(inviteCode: string, characterId: string) {
  const user = await getAuthenticatedUser();

  const partyId = await verifyInviteToken(inviteCode);
  if (!partyId) throw new Error("Invalid or expired invite link");

  const party = await prisma.party.findUnique({
    where: { id: partyId },
    include: { members: true },
  });

  if (!party || !party.isActive) throw new Error("Party not found or inactive");

  // Check character belongs to user
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });
  if (!character || character.userId !== user.id) {
    throw new Error("Character not found or does not belong to you");
  }

  // Check if user already is a member
  const alreadyMember = party.members.some((m) => m.userId === user.id);
  if (alreadyMember) throw new Error("Already a member of this party");

  await prisma.partyMember.create({
    data: {
      partyId: party.id,
      userId: user.id,
      characterId,
      isLeader: false,
    },
  });

  revalidatePath("/dashboard/party");
  return serializeBigInt(party);
}

export async function removeMember(partyId: string, memberId: string) {
  const user = await getAuthenticatedUser();

  const party = await prisma.party.findUnique({ where: { id: partyId } });
  if (!party || party.createdBy !== user.id) throw new Error("Forbidden");

  await prisma.partyMember.delete({ where: { id: memberId } });

  revalidatePath("/dashboard/party");
  return { success: true };
}

// ─── Hunt Sessions ──────────────────────────────────────────────────────────

export async function addHuntSession(
  partyId: string,
  data: {
    huntName: string;
    huntDate?: string;
    duration?: number;
    loot: number;
    supplies: number;
    balance: number;
    rawSessionData?: string;
  },
) {
  const user = await getAuthenticatedUser();

  // Verify membership
  const membership = await prisma.partyMember.findFirst({
    where: { partyId, userId: user.id },
  });
  if (!membership) throw new Error("Not a member of this party");

  const session = await prisma.huntSession.create({
    data: {
      partyId,
      huntName: data.huntName,
      huntDate: data.huntDate ? new Date(data.huntDate) : new Date(),
      duration: data.duration,
      loot: BigInt(data.loot),
      supplies: BigInt(data.supplies),
      balance: BigInt(data.balance),
      rawSessionData: data.rawSessionData,
    },
  });

  revalidatePath(`/dashboard/party/${partyId}`);
  return serializeBigInt(session);
}

export async function deleteHuntSession(sessionId: string) {
  const user = await getAuthenticatedUser();

  const session = await prisma.huntSession.findUnique({
    where: { id: sessionId },
    include: { party: true },
  });
  if (!session) throw new Error("Session not found");

  const membership = await prisma.partyMember.findFirst({
    where: { partyId: session.partyId, userId: user.id },
  });
  if (!membership) throw new Error("Forbidden");

  await prisma.huntSession.delete({ where: { id: sessionId } });

  revalidatePath(`/dashboard/party/${session.partyId}`);
  return { success: true };
}

// ─── Drops ──────────────────────────────────────────────────────────────────

export async function addDrop(
  partyId: string,
  data: {
    itemName: string;
    itemId?: number;
    quantity: number;
    value: number;
    droppedAt?: string;
  },
) {
  const user = await getAuthenticatedUser();

  const membership = await prisma.partyMember.findFirst({
    where: { partyId, userId: user.id },
  });
  if (!membership) throw new Error("Not a member of this party");

  const drop = await prisma.partyDrop.create({
    data: {
      partyId,
      itemName: data.itemName,
      itemId: data.itemId,
      quantity: data.quantity,
      value: BigInt(data.value),
      droppedAt: data.droppedAt ? new Date(data.droppedAt) : new Date(),
    },
  });

  revalidatePath(`/dashboard/party/${partyId}`);
  return serializeBigInt(drop);
}

export async function deleteDrop(dropId: string) {
  const user = await getAuthenticatedUser();

  const drop = await prisma.partyDrop.findUnique({
    where: { id: dropId },
    include: { party: true },
  });
  if (!drop) throw new Error("Drop not found");

  const membership = await prisma.partyMember.findFirst({
    where: { partyId: drop.partyId, userId: user.id },
  });
  if (!membership) throw new Error("Forbidden");

  await prisma.partyDrop.delete({ where: { id: dropId } });

  revalidatePath(`/dashboard/party/${drop.partyId}`);
  return { success: true };
}

export async function toggleDropSold(dropId: string) {
  const user = await getAuthenticatedUser();

  const drop = await prisma.partyDrop.findUnique({
    where: { id: dropId },
  });
  if (!drop) throw new Error("Drop not found");

  const membership = await prisma.partyMember.findFirst({
    where: { partyId: drop.partyId, userId: user.id },
  });
  if (!membership) throw new Error("Forbidden");

  const updated = await prisma.partyDrop.update({
    where: { id: dropId },
    data: { sold: !drop.sold },
  });

  revalidatePath(`/dashboard/party/${drop.partyId}`);
  return serializeBigInt(updated);
}

// ─── Public Profile ─────────────────────────────────────────────────────────

export async function togglePublicProfile(partyId: string) {
  const user = await getAuthenticatedUser();

  const party = await prisma.party.findUnique({ where: { id: partyId } });
  if (!party || party.createdBy !== user.id) throw new Error("Forbidden");

  const newIsPublic = !party.isPublic;
  const slug = newIsPublic
    ? party.slug || slugify(party.name) || party.id
    : party.slug;

  const updated = await prisma.party.update({
    where: { id: partyId },
    data: { isPublic: newIsPublic, slug },
  });

  revalidatePath(`/dashboard/party/${partyId}`);
  return serializeBigInt(updated);
}
