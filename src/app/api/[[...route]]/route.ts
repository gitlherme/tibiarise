import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import experienceByWorld from "./experience-by-world";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use(logger());
app.route("/get-experience-by-world", experienceByWorld);

export const GET = handle(app);
export const POST = handle(app);
