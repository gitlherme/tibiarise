export type ExperienceTableValue = {
  date: string;
  expChange: number;
  vocationRank: number;
  level: number;
  totalExperience: number;
};

export type CharacterData = {
  characterInfo: CharacterInfo;
  experienceTable: { date: string | null; value: number | null }[] | null;
};

export type CharacterInfo = {
  guild_name: string | null;
  guild_rank: string | null;
  id: number;
  level: number | null;
  name: string | null;
  user_id: number | null;
  vocation: string | null;
  vocation_rank: number | null;
  world: string | null;
};
