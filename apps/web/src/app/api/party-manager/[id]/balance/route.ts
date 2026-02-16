import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";
import { subDays, subMonths, subWeeks } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

function getDateFilter(period?: string | null): Date | undefined {
  if (!period) return undefined;
  const now = new Date();
  switch (period) {
    case "week":
      return subWeeks(now, 1);
    case "month":
      return subMonths(now, 1);
    case "year":
      return subDays(now, 365);
    default:
      return undefined;
  }
}

// GET - Computed party balance
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const membership = await prisma.partyMember.findFirst({
      where: { partyId: id, userId: user.id },
    });
    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const period = request.nextUrl.searchParams.get("period");
    const dateFilter = getDateFilter(period);

    const dateWhere = dateFilter ? { huntDate: { gte: dateFilter } } : {};
    const dropDateWhere = dateFilter ? { droppedAt: { gte: dateFilter } } : {};

    const [sessions, drops] = await Promise.all([
      prisma.huntSession.findMany({
        where: { partyId: id, ...dateWhere },
      }),
      prisma.partyDrop.findMany({
        where: { partyId: id, ...dropDateWhere },
      }),
    ]);

    let totalLoot = BigInt(0);
    let totalSupplies = BigInt(0);
    let netBalance = BigInt(0);

    for (const s of sessions) {
      totalLoot += s.loot;
      totalSupplies += s.supplies;
      netBalance += s.balance;
    }

    let totalDropsValue = BigInt(0);
    let totalDropsValueTc = BigInt(0);

    for (const d of drops) {
      if (d.currency === "TIBIA_COIN") {
        totalDropsValueTc += d.value * BigInt(d.quantity);
      } else {
        totalDropsValue += d.value * BigInt(d.quantity);
      }
    }

    return NextResponse.json(
      serializeBigInt({
        totalLoot,
        totalSupplies,
        netBalance,
        totalDropsValue,
        totalDropsValueTc,
        sessionCount: sessions.length,
        dropCount: drops.length,
      }),
    );
  } catch (error) {
    console.error("Error computing balance:", error);
    return NextResponse.json(
      { error: "Failed to compute balance" },
      { status: 500 },
    );
  }
}
