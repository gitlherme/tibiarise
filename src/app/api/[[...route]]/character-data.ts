import { supabase } from "@/lib/supabase/supabase";
import { CharacterModel } from "@/models/character.model";
import axios from "axios";
import { Hono } from "hono";
import moment from "moment";

const app = new Hono();

app.get("/", async (c) => {
  const { searchParams } = new URL(c.req.url);
  const name = searchParams.get("name");

  const { data: character } = await supabase
    .from("character")
    .select("*")
    .ilike("name", `%${name}`);

  const { data: experiences } = await supabase
    .from("daily_experience")
    .select("*")
    .eq("character_id", character![0].id);

  console.log("experiences", experiences);

  const experienceTable = experiences
    ?.map((experience, index) => {
      if (index !== 0 && experience.value! !== experiences[index - 1].value!) {
        return {
          date: moment(experience.date)
            .subtract(1, "days")
            .format("YYYY-MM-DD"),
          experience:
            experience.value! - experiences[index - 1].value! ||
            experience.value!,
          totalExperience: experience.value,
          level: experience.level,
        };
      }
      return;
    })
    .filter((experience) => experience);

  const { data: characterInfo } = await axios.get<CharacterModel>(
    `${process.env.NEXT_PUBLIC_DATA_API}/character/${name}`
  );

  const { level, world, vocation, sex, guild } =
    characterInfo.character.character;

  return c.json(
    {
      character: {
        name: character![0].name,
        level,
        world,
        vocation,
        sex,
        guild,
      },
      experienceTable: experienceTable,
    },
    200
  );
});

export default app;
