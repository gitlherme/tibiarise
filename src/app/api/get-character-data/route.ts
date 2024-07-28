import { cheerio } from "@/lib/cheerio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const response = await fetch(
    `https://guildstats.eu/character?nick=${name}&tab=7`
  );

  const page = cheerio((await response.text()).trim());

  const experienceTable = await page(".newTable").eq(1).text();

  const getCharacterInfo = await fetch(
    `https://api.tibiadata.com/v4/character/${name}`
  ).then((res) => res.json());

  const characterInfo = getCharacterInfo.character.character;

  return NextResponse.json({ experienceTable, characterInfo }, { status: 200 });
}
