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

// GET - List drops for a party
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

    const drops = await prisma.partyDrop.findMany({
      where: {
        partyId: id,
        ...(dateFilter ? { droppedAt: { gte: dateFilter } } : {}),
      },
      orderBy: { droppedAt: "desc" },
    });

    return NextResponse.json(serializeBigInt(drops));
  } catch (error) {
    console.error("Error fetching drops:", error);
    return NextResponse.json(
      { error: "Failed to fetch drops" },
      { status: 500 },
    );
  }
}
