import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/worlds`);
  const data = await response.json();
  const worlds = data.worlds.regular_worlds.map((world: any) => world.name);

  return c.json({ worlds }, { status: 200 });
});

export default app;
