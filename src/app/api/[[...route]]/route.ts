import { Hono } from "hono";
import { handle } from "hono/vercel";
import characterData from "./character-data";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.route("/get-character-data", characterData);

export const GET = handle(app);
export const POST = handle(app);
