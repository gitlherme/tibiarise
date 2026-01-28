// Removed ExperienceTableValue and Character to avoid duplicates

import {
  AccountBadge,
  AccountInformation,
  Achievement,
  Death,
  Guild,
  House,
  OtherCharacter,
} from "./tibia-common.model";

export interface TibiaDataCharacterEndpoint {
  account_badges: AccountBadge[];
  account_information: AccountInformation;
  achievements: Achievement[];
  character: TibiaDataCharacter;
  deaths: Death[];
  deaths_truncated: boolean;
  other_characters: OtherCharacter[];
}

export interface TibiaDataCharacter {
  character: {
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
  };
}
