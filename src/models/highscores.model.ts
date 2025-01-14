export interface HighscoreModel {
  highscores: Highscores;
  information: Information;
}

export interface Highscores {
  category: string;
  highscore_age: number;
  highscore_list: HighscoreList[];
  highscore_page: HighscorePage;
  vocation: string;
  world: string;
}

export interface HighscoreList {
  level: number;
  name: string;
  rank: number;
  title: string;
  value: number;
  vocation: string;
  world: string;
}

export interface HighscorePage {
  current_page: number;
  total_pages: number;
  total_records: number;
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
