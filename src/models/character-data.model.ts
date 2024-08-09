export type ExperienceTableValue = {
  date: string;
  expChange: number;
  vocationRank: number;
  level: number;
  totalExperience: number;
}

export type CharacterData = {
  characterInfo: CharacterInfo;
  experienceTable: ExperienceTableValue[];
}

export type CharacterInfo = {
  comment: string
  deletion_date: string
  former_names: string[]
  former_worlds: string[]
  level: number
  name: string
  sex: string
  vocation: string
  world: string
}
