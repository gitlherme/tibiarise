import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import characterData from "./character-data";
import experienceByWorld from "./experience-by-world";
import worlds from "./worlds";
import playersExperienceCron from "./cron/players-experience";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use(logger());

app.route("/get-character-data", characterData);
app.route("/get-experience-by-world", experienceByWorld);
app.route("/get-worlds", worlds);
app.route("/cron/players-experience", playersExperienceCron);

export const GET = handle(app);
export const POST = handle(app);
