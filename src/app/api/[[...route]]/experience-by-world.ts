import { cheerio } from "@/lib/cheerio";
import { Hono } from "hono";
import axios from "axios";
import sanitize from "sanitize-html";
import { parseExperienceByWorld } from "@/utils/parse-experience-by-world";

const app = new Hono();

app.get("/", async (c) => {
  const { searchParams } = new URL(c.req.url);
  const world = searchParams.get("world");
  const filter = searchParams.get("filter");

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_STATS_API}/mostexp?world=${world}&time=${filter}`
  );

  const page = cheerio(await data);
  const table = page(".newTable").eq(0).text();
  const sanitizedTable = sanitize(table);

  const experienceTable = parseExperienceByWorld(sanitizedTable);

  if (experienceTable.length > 0) {
    return c.json({ experienceTable }, { status: 200 });
  }

  return c.json({ message: "Error on get world" }, { status: 400 });
});

export default app;
