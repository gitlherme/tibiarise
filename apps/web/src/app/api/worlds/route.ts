import { NextResponse } from "next/server";

interface WorldsApiResponse {
  worlds: {
    players_online: number;
    record_date: string;
    record_players: number;
    regular_worlds: {
      name: string;
      players_online: number;
      location: string;
      pvp_type: string;
      status: string;
    }[];
    tournament_worlds: {
      name: string;
      players_online: number;
      location: string;
      pvp_type: string;
      status: string;
    }[];
  };
}

const TIBIA_DATA_API_URL =
  process.env.TIBIA_DATA_API_URL || "https://api.tibiadata.com/v4";

export async function GET() {
  try {
    const response = await fetch(`${TIBIA_DATA_API_URL}/worlds`);
    const data: WorldsApiResponse = await response.json();

    const worlds = data.worlds.regular_worlds.map((world) => world.name);

    return NextResponse.json({ worlds });
  } catch (error) {
    console.error("Error fetching worlds:", error);
    return NextResponse.json(
      { error: "Failed to fetch worlds" },
      { status: 500 },
    );
  }
}
