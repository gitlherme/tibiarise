import { ExperienceTableValue } from "./tibia-common.model";

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
  isVerified: boolean;
  verifiedAt: string | null;
  streak: number;
  guild: {
    name: string;
    rank: string;
  };
};
