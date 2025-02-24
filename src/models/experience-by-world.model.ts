export enum ByWorldFilter {
  "DAY" = "daily",
  "WEEK" = "weekly",
  "MONTH" = "monthly",
}

type PlayerExperienceByWorld = {
  characterId: string;
  characterName: string;
  level: number;
  world: string;
  experienceGained: number;
  experiencePerHour: number;
  percentageGain: number;
};

export type ExperienceByWorld = {
  world: string;
  period: {
    type: ByWorldFilter;
    startDate: Date;
    endDate: Date;
  };
  topGainers: PlayerExperienceByWorld[];
};
