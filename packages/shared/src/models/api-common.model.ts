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
