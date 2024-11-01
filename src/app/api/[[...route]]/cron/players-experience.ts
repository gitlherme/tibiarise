import { Hono } from "hono";
import axios from "axios";
import { supabase } from "@/lib/supabase/supabase";
import { HighscoreModel, Highscores } from "@/models/highscores.model";
import { Character, CharacterModel } from "@/models/character.model";

const app = new Hono();

const fetchHighscorePage = async (page: number, world: string) => {
  const highscoresURL = `${process.env.NEXT_PUBLIC_DATA_API}/highscores/${world}/experience/all/${page}`;
  const { data } = await axios.get<HighscoreModel>(highscoresURL);
  return data;
};

app.get("/", async (c) => {
  const TOTAL_PAGES = 20;
  let CURRENT_PAGE = 1;

  const { data } = await axios.get(`http://localhost:3000/api/get-worlds`);
  const worlds = data.worlds;

  worlds.forEach(async (world: string) => {
    if (world !== "Descubra") {
      return;
    }
    while (CURRENT_PAGE <= TOTAL_PAGES) {
      const highscorePage = await fetchHighscorePage(CURRENT_PAGE, world);
      highscorePage.highscores.highscore_list.forEach(async (character) => {
        let nameToFind = character.name;
        let characterHasSpace = nameToFind.includes(" ");
        if (characterHasSpace) {
          nameToFind = nameToFind.replaceAll(" ", "+");
        }

        const { data: characterExists } = await supabase
          .from("character")
          .select("*")
          .eq("name", character.name);

        try {
          if (characterExists?.length === 0) {
            const characterURL = `${process.env.NEXT_PUBLIC_DATA_API}/character/${nameToFind}`;
            const { data: characterData } = await axios.get<CharacterModel>(
              characterURL
            );
            const { data: createdCharacter } = await supabase
              .from("character")
              .insert([
                {
                  name: characterData.character.character.name,
                  level: characterData.character.character.level,
                  vocation: characterData.character.character.vocation,
                  world: characterData.character.character.world,
                  guild_name: characterData.character.character.guild.name,
                  guild_rank: characterData.character.character.guild.rank,
                },
              ])
              .select();

            if (createdCharacter) {
              await supabase.from("daily_experience").insert([
                {
                  character_id: createdCharacter[0].id,
                  value: character.value,
                  date: new Date().toISOString().split("T")[0],
                },
              ]);
            }

            return;
          }

          if (characterExists && characterExists.length > 0) {
            const { data: dailyExperienceExists } = await supabase
              .from("daily_experience")
              .select("*")
              .eq("character_id", characterExists[0].id)
              .eq("date", new Date().toISOString().split("T")[0]);

            if (dailyExperienceExists && dailyExperienceExists.length === 0) {
              await supabase.from("daily_experience").insert([
                {
                  character_id: characterExists[0].id,
                  value: character.value,
                  date: new Date().toISOString().split("T")[0],
                },
              ]);
            }
          }
        } catch (error) {
          console.error("Error inserting character", error);
        }
      });

      CURRENT_PAGE++;
    }
  });

  if (CURRENT_PAGE === TOTAL_PAGES) {
    CURRENT_PAGE = 1;
  }

  return c.json({ message: "Xama" });
});

export default app;
