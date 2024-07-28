import * as ch from "cheerio";

export const cheerio = (html: string) => ch.load(html);
