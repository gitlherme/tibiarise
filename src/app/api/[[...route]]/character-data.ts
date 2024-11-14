import { supabase } from "@/lib/supabase/supabase";
import { CharacterData, CharacterInfo } from "@/models/character-data.model";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const characterArrayData: CharacterData = {
    characterInfo: {} as CharacterInfo,
    experienceTable: [],
  };
  const { searchParams } = new URL(c.req.url);
  const name = String(searchParams.get("name"));

  console.log("name", name);

  const { data: character } = await supabase
    .from("character")
    .select("*")
    .eq("name", "Gui");

  characterArrayData.characterInfo = character as unknown as CharacterInfo;

  if ((character && character.length < 1) || !character)
    return c.json({ message: "Error trying get character" }, 404);

  const { data: dailyExperience } = await supabase
    .from("daily_experience")
    .select("date, value")
    .eq("character_id", character![0].id);

  dailyExperience?.map((day) => {
    characterArrayData.experienceTable?.push(day);
  });

  if (characterArrayData && characterArrayData.experienceTable!.length > 0) {
    return c.json(characterArrayData, { status: 200 });
  }

  return c.json({ error: "Character not found" }, { status: 404 });
});

export default app;
