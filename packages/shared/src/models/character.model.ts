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

import {
  AccountBadge,
  AccountInformation,
  Achievement,
  Death,
  Guild,
  House,
  OtherCharacter,
} from "./tibia-common.model";

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

import { Information } from "./api-common.model";
