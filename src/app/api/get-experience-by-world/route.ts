import { cheerio } from "@/lib/cheerio";
import { parseExperienceByWorld } from "@/utils/parseExperienceByWorld";
import { NextRequest, NextResponse } from "next/server";
import sanitize from "sanitize-html";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const world = searchParams.get("world");
  const filter = searchParams.get("filter");

  const data = await fetch(
    `https://guildstats.eu/mostexp?world=${world}&time=${filter}`
  );

  const page = cheerio((await data.text()).trim());
  const table = await page(".newTable").eq(0).text();
  const sanitizedTable = sanitize(table);

  const experienceTable = parseExperienceByWorld(sanitizedTable);

  return NextResponse.json({ experienceTable }, { status: 200 });
}
