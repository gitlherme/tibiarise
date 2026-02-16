import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const party = await prisma.party.findFirst({
    where: {
      slug,
      isPublic: true,
      isActive: true,
    },
    include: {
      members: {
        include: {
          character: {
            include: {
              dailyExperience: {
                orderBy: { date: "desc" },
                take: 30, // Last 30 entries for the chart
              },
            },
          },
          user: { select: { id: true, email: true } },
        },
      },
    },
  });

  if (!party) {
    return NextResponse.json({ error: "Party not found" }, { status: 404 });
  }

  // Fetch aggregated balance data
  const sessions = await prisma.huntSession.findMany({
    where: { partyId: party.id },
    orderBy: { huntDate: "desc" },
    take: 10,
  });

  const drops = await prisma.partyDrop.findMany({
    where: { partyId: party.id },
    orderBy: { droppedAt: "desc" },
  });

  // Calculate balance totals
  const allSessions = await prisma.huntSession.aggregate({
    where: { partyId: party.id },
    _sum: { loot: true, supplies: true, balance: true },
    _count: true,
  });

  const allDrops = await prisma.partyDrop.aggregate({
    where: { partyId: party.id },
    _count: true,
  });

  // Sum drop values manually since Prisma aggregate may not handle BigInt well
  const dropValues = await prisma.partyDrop.findMany({
    where: { partyId: party.id },
    select: { value: true, quantity: true },
  });
  const totalDropsValue = dropValues.reduce(
    (acc, d) => acc + Number(d.value) * d.quantity,
    0,
  );

  const result = {
    party: serializeBigInt(party),
    recentSessions: serializeBigInt(sessions),
    recentDrops: serializeBigInt(drops),
    stats: {
      totalLoot: Number(allSessions._sum.loot || 0),
      totalSupplies: Number(allSessions._sum.supplies || 0),
      netBalance: Number(allSessions._sum.balance || 0),
      sessionCount: allSessions._count,
      dropCount: allDrops._count,
      dropsValue: totalDropsValue,
    },
  };

  return NextResponse.json(result);
}
