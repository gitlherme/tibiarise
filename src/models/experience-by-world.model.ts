export enum ByWorldFilter {
  "DAY" = 0,
  "WEEK" = 7,
  "MONTH" = 30,
}

type PlayerExperienceByWorld = {
  name: string;
  level: number;
  experience: number;
  vocation: string;
};

export type ExperienceByWorld = {
  experienceTable: PlayerExperienceByWorld[];
};
