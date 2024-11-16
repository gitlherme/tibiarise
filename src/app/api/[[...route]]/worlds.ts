import axios from "axios";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  console.log("URL", process.env.NEXT_PUBLIC_DATA_API);
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_DATA_API}/worlds`
  );

  console.log(data);
  const worlds = data.worlds.regular_worlds.map((world: any) => world.name);

  if (!worlds) {
    return c.json({ error: "No worlds found" }, { status: 404 });
  }

  return c.json({ worlds }, { status: 200 });
});

export default app;
