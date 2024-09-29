import { cheerio } from "@/lib/cheerio";
import { CharacterData } from "@/models/character-data.model";
import { parseCharacterTableExperience } from "@/utils/parseCharacterTableExperience";
import { Hono } from "hono";
import sanitize from "sanitize-html";

const app = new Hono();

app.get("/", async (c) => {
  const { searchParams } = new URL(c.req.url);
  const name = searchParams.get("name");
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_STATS_API}/character?nick=${name}&tab=7`
  );

  const page = cheerio((await data.text()).trim());
  const table = await page(".newTable").eq(1).text();
  const sanitizedTable = sanitize(table);
  const experienceTable = parseCharacterTableExperience(sanitizedTable);

  const { character: getCharacterInfo } = await fetch(
    `${process.env.NEXT_PUBLIC_DATA_API}/character/${name}`
  ).then((res) => res.json());

  const characterInfo = {
    ...getCharacterInfo.character,
    deaths: getCharacterInfo.deaths || [],
  };

  const response: CharacterData = { experienceTable, characterInfo };

  if (response.experienceTable.length > 0) {
    return c.json(response, { status: 200 });
  }

  return c.json({ error: "Character not found" }, { status: 404 });
});

export default app;
