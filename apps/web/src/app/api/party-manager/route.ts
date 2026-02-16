import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";
import { NextResponse } from "next/server";

// GET - List current user's parties
export async function GET() {
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

    const parties = await prisma.party.findMany({
      where: {
        isActive: true,
        members: {
          some: { userId: user.id },
        },
      },
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
