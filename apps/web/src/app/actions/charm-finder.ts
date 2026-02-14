"use server";

import { TibiaWikiCreature } from "@/models/tibia-data.model";

export async function getCreatureDetails(
  name: string,
): Promise<TibiaWikiCreature | null> {
  try {
    // Title Case the name as required by TibiaWiki API
    // Must handle hyphens too (e.g. "Bloated Man-Maggot")
    const titleCaseName = name
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("-"),
      )
      .join(" ");

    const response = await fetch(
      `https://tibiawiki.dev/api/creatures/${encodeURIComponent(titleCaseName)}`,
      {
        headers: {
          "User-Agent": "TibiaRise/1.0",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    console.log(response);

    if (!response.ok) {
      console.error(
        `TibiaWiki API Error: ${response.status} for ${titleCaseName}`,
      );
      return null;
    }

    const data = await response.json();

    if (data.bestiaryname) {
      data.image_url = `https://static.tibia.com/images/library/${data.bestiaryname}.gif`;
    }

    return data as TibiaWikiCreature;
  } catch (error) {
    console.error(`Failed to fetch creature details for ${name}:`, error);
    return null;
  }
}
