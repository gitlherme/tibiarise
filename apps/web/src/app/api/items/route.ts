import { NextRequest, NextResponse } from "next/server";

// Proxy to TibiaWiki API for item search
// Items are cached in-memory for 24 hours since game updates are rare (~every 6 months)

let cachedItems: string[] = [];
let lastFetchTime = 0;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

async function fetchAllItems() {
  const now = Date.now();
  if (cachedItems.length > 0 && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedItems;
  }

  try {
    const response = await fetch("https://tibiawiki.dev/api/items", {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`TibiaWiki API error: ${response.status}`);
    }

    const data = await response.json();
    cachedItems = Array.isArray(data) ? data : [];
    lastFetchTime = now;
    return cachedItems;
  } catch (error) {
    console.error("Error fetching items from TibiaWiki:", error);
    // Return cached items if available, even if expired
    if (cachedItems.length > 0) return cachedItems;
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json([]);
    }

    const items = await fetchAllItems();
    const lowerQuery = query.toLowerCase();

    // TibiaWiki API returns a plain string array of item names
    // Map to objects with { name } for consistent downstream usage
    const filtered = items
      .filter((item) => item.toLowerCase().includes(lowerQuery))
      .slice(0, 20)
      .map((name) => ({ name }));

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error searching items:", error);
    return NextResponse.json(
      { error: "Failed to search items" },
      { status: 500 },
    );
  }
}
