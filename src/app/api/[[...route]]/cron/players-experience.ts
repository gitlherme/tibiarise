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
    while (CURRENT_PAGE <= TOTAL_PAGES) {
      const highscorePage = await fetchHighscorePage(CURRENT_PAGE, world);
      highscorePage.highscores.highscore_list.forEach(async (character) => {
        let name = character.name;
        let characterHasSpace = name.includes(" ");
        if (characterHasSpace) {
          name = name.replaceAll(" ", "+");
        }

        const { data: sbCharacter } = await supabase
          .from("character")
          .select("*")
          .eq("name", character.name);

        setTimeout(async () => {
          try {
            if (!sbCharacter) {
              const characterURL = `${process.env.NEXT_PUBLIC_DATA_API}/character/${name}`;
              const { data: characterData } = await axios.get<CharacterModel>(
                characterURL
              );
              console.warn("Adding Character to database");
              await supabase
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
            }

            await supabase.from("daily_experience").insert([
              {
                character_id: sbCharacter?.[0].id,
                value: character.value,
                date: new Date().toISOString().split("T")[0],
              },
            ]);
          } catch (error) {
            console.error("Error inserting character");
          }
        }, 1000);
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
