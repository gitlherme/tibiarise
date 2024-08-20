import { cheerio } from "@/lib/cheerio";
import { CharacterData } from "@/models/character-data.model";
import { parseCharacterTableExperience } from "@/utils/parseCharacterTableExperience";
import { NextRequest, NextResponse } from "next/server";
import sanitize from "sanitize-html";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const data = await fetch(
    `https://guildstats.eu/character?nick=${name}&tab=7`
  );

  const page = cheerio((await data.text()).trim());
  const table = await page(".newTable").eq(1).text();
  const sanitizedTable = sanitize(table);
  const experienceTable = parseCharacterTableExperience(sanitizedTable);

  const { character: getCharacterInfo } = await fetch(
    `https://api.tibiadata.com/v4/character/${name}`
  ).then((res) => res.json());

  const characterInfo = getCharacterInfo.character;

  const response: CharacterData = { experienceTable, characterInfo };

  if (response.experienceTable.length > 0) {
    return NextResponse.json(response, { status: 200 });
  }

  return NextResponse.json({ error: "Character not found" }, { status: 404 });
}
