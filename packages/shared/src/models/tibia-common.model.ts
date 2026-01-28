export interface AccountBadge {
  description: string;
  icon_url: string;
  name: string;
}

export interface AccountInformation {
  created: string;
  loyalty_title: string;
  position: string;
}

export interface Achievement {
  grade: number;
  name: string;
  secret: boolean;
}

export interface Guild {
  name: string;
  rank: string;
}

export interface House {
  houseid: number;
  name: string;
  paid: string;
  town: string;
}

export interface Death {
  assists: Assist[];
  killers: Killer[];
  level: number;
  reason: string;
  time: string;
}

export interface Assist {
  name: string;
  player: boolean;
  summon: string;
  traded: boolean;
}

export interface Killer {
  name: string;
  player: boolean;
  summon: string;
  traded: boolean;
}

export interface OtherCharacter {
  deleted: boolean;
  main: boolean;
  name: string;
  position: string;
  status: string;
  traded: boolean;
  world: string;
}

export type ExperienceTableValue = {
  date: string;
  experience: number;
  totalExperience: number;
  level: number;
};
