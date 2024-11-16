export type ExperienceTableValue = {
  date: string;
  experience: number;
  totalExperience: number;
  level: number;
};

export type CharacterData = {
  character: CharacterInfo;
  experienceTable: ExperienceTableValue[];
};

type CharacterInfo = {
  name: string;
  level: string;
  world: string;
  vocation: string;
  sex: string;
  guild: {
    name: string;
    rank: string;
  };
};
