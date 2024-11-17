import { Hono } from "hono";
import axios from "axios";
import { supabase } from "@/lib/supabase/supabase";
import { HighscoreModel } from "@/models/highscores.model";
import { CharacterModel } from "@/models/character.model";
import moment from "moment";

const app = new Hono();

const fetchHighscorePage = async (page: number, world: string) => {
  const highscoresURL = `${process.env.NEXT_PUBLIC_DATA_API}/highscores/${world}/experience/all/${page}`;
  const { data } = await axios.get<HighscoreModel>(highscoresURL);
  return data;
};

app.get("/", async (c) => {
  const { searchParams } = new URL(c.req.url);
  const world = searchParams.get("world");

  const TOTAL_PAGES = 20;
  let CURRENT_PAGE = 1;

  await setTimeout(async () => {
    while (CURRENT_PAGE <= TOTAL_PAGES) {
      const highscorePage = await fetchHighscorePage(
        CURRENT_PAGE,
        String(world)
      );
      highscorePage.highscores.highscore_list.forEach(async (character) => {
        setTimeout(async () => {
          let nameToFind = character.name;
          let characterHasSpace = nameToFind.includes(" ");
          if (characterHasSpace) {
            nameToFind = nameToFind.replaceAll(" ", "+");
          }

          const { data: characterExists } = await supabase
            .from("character")
            .select("*")
            .ilike("name", `%${character.name}`);

          if (characterExists?.length === 0) {
            console.warn(
              `Character ${character.name} not found in database, trying to add...`
            );
            const characterURL = `${process.env.NEXT_PUBLIC_DATA_API}/character/${nameToFind}`;
            const { data: characterData } = await axios.get<CharacterModel>(
              characterURL
            );

            const { data: createdCharacter, status: createdCharacterStatus } =
              await supabase
                .from("character")
                .insert([
                  {
                    name: characterData.character.character.name,
                  },
                ])
                .select();

            if (createdCharacterStatus === 201 && createdCharacter) {
              console.warn(`Character ${character.name} added to database`);
            }

            if (createdCharacter) {
              await supabase.from("daily_experience").insert([
                {
                  character_id: createdCharacter[0].id,
                  value: character.value,
                  date: moment().format("YYYY-MM-DD"),
                  level: character.level,
                },
              ]);
            }

            return;
          }

          if (characterExists && characterExists.length > 0) {
            console.warn(`Character ${character.name} already in database`);
            const { data: dailyExperienceExists } = await supabase
              .from("daily_experience")
              .select("*")
              .eq("character_id", characterExists[0].id)
              .eq("date", moment().format("YYYY-MM-DD"));

            if (dailyExperienceExists && dailyExperienceExists.length === 0) {
              await supabase.from("daily_experience").insert([
                {
                  character_id: characterExists[0].id,
                  value: character.value,
                  date: moment().format("YYYY-MM-DD"),
                  level: character.level,
                },
              ]);
            }
          }
        });
      });
      CURRENT_PAGE++;
    }
  });

  return await c.json({ message: `Cron job for ${world} finished` });
});

export default app;
