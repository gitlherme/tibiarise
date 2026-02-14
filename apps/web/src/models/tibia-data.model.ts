export type ExperienceTableValue = {
  date: string;
  experience: number;
  totalExperience: number;
  level: number;
};

export type Character = {
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

export interface TibiaDataCharacterEndpoint {
  account_badges: AccountBadge[];
  account_information: AccountInformation;
  achievements: Achievement[];
  character: TibiaDataCharacter;
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

export interface TibiaDataCreatureEndpoint {
  creature: TibiaDataCreature;
}

export interface TibiaDataCreature {
  beastiary_slug: string;
  beastiary_name: string;
  name: string;
  race: string;
  image_url: string;
  description: string;
  behaviour: string;
  hitpoints: number;
  immune?: string[];
  strong?: string[];
  weakness?: string[];
  healed?: string[];
  experience_points: number;
  loot_list?: string[];
}

export interface TibiaWikiCreature {
  name: string;
  actualname: string;
  hp: string;
  exp: string;
  maxdmg: string;
  summon: string;
  weakness: [];
  illusionable: string;
  pushable: string;
  pushes: string;
  physicalDmgMod: string;
  holyDmgMod: string;
  deathDmgMod: string;
  fireDmgMod: string;
  energyDmgMod: string;
  iceDmgMod: string;
  earthDmgMod: string;
  drownDmgMod: string;
  lifedrainDmgMod: string;
  manadrainDmgMod: string;
  bestiaryname?: string;
  image_url?: string; // Optional, might be constructed or fetched
  immune?: string[]; // TibiaWiki usually returns strings like "fire, earth" or array?
  mitigation?: string; // e.g. "2.92"
} // Actually the API returns percentage strings like "100%", "0%".
// The immune field is redundant if DmgMod is "0%".

export interface TibiaDataCreatureEndpoint {
  creature: TibiaDataCreature;
}

export interface TibiaDataCreature {
  beastiary_slug: string;
  beastiary_name: string;
  name: string;
  race: string;
  image_url: string;
  description: string;
  behaviour: string;
  hitpoints: number;
  immune?: string[];
  strong?: string[];
  weakness?: string[];
  healed?: string[];
  experience_points: number;
  loot_list?: string[];
  // Add other fields as necessary based on API response
}
