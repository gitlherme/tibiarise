import { NextRequest, NextResponse } from "next/server";

// Proxy to TibiaWiki API for hunting places search
// Hunting places are cached in-memory for 24 hours

let cachedPlaces: string[] = [];
let lastFetchTime = 0;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

async function fetchAllPlaces() {
  const now = Date.now();
  if (cachedPlaces.length > 0 && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedPlaces;
  }

  try {
    const response = await fetch("https://tibiawiki.dev/api/huntingplaces", {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`TibiaWiki API error: ${response.status}`);
    }

    const data = await response.json();
    cachedPlaces = Array.isArray(data) ? data : [];
    lastFetchTime = now;
    return cachedPlaces;
  } catch (error) {
    console.error("Error fetching hunting places from TibiaWiki:", error);
    // Return cached places if available, even if expired
    if (cachedPlaces.length > 0) return cachedPlaces;
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") || "";

    const places = await fetchAllPlaces();

    // If no query, return empty list to avoid sending huge payload unnecessarily
    // or return all if that's the desired behavior (tibiawiki returns all strings)
    // For autocomplete, we usually want filtering.

    if (query.length < 2) {
      return NextResponse.json([]);
    }

    const lowerQuery = query.toLowerCase();

    // TibiaWiki API returns a plain string array of place names
    // Map to objects with { name } for consistent downstream usage
    const filtered = places
      .filter((place) => place.toLowerCase().includes(lowerQuery))
      .slice(0, 20)
      .map((name) => ({ name }));

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error searching hunting places:", error);
    return NextResponse.json(
      { error: "Failed to search hunting places" },
      { status: 500 },
    );
  }
}
