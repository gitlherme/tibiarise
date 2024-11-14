export interface CharacterModel {
  character: Character;
  information: Information;
}

export interface Character {
  account_badges: AccountBadge[];
  account_information: AccountInformation;
  achievements: Achievement[];
  character: Character2;
  deaths: Death[];
  deaths_truncated: boolean;
  other_characters: OtherCharacter[];
}

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

export interface Character2 {
  account_status: string;
  achievement_points: number;
  comment: string;
  deletion_date: string;
  former_names: string[];
  former_worlds: string[];
  guild: Guild;
  houses: House[];
  last_login: string;
  level: number;
  married_to: string;
  name: string;
  position: string;
  residence: string;
  sex: string;
  title: string;
  traded: boolean;
  unlocked_titles: number;
  vocation: string;
  world: string;
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

export interface Information {
  api: Api;
  status: Status;
  timestamp: string;
}

export interface Api {
  commit: string;
  release: string;
  version: number;
}

export interface Status {
  error: number;
  http_code: number;
  message: string;
}
