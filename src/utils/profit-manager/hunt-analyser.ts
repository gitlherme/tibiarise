export function extractSessionData(sessionData: string): {
  date: Date;
  grossProfit: string;
} | null {
  try {
    const dateMatch = sessionData.match(/From (\d{4}-\d{2}-\d{2})/);
    const balanceMatch = sessionData.match(/Balance: ([-\d,]+)/);

    if (dateMatch && balanceMatch) {
      const dateString = dateMatch[1];
      const balanceString = balanceMatch[1].replace(/,/g, "");

      const date = new Date(dateString);
      let grossProfit = parseFloat(balanceString);

      if (isNaN(date.getTime()) || isNaN(grossProfit)) {
        console.error("Failed to parse date or grossProfit.");
        return null;
      }

      const playerRegex = /\n\s*([A-Za-z\s()]+)\n\s*Loot:/g;
      const playerMatches = [...sessionData.matchAll(playerRegex)];

      const isPartyHunt = playerMatches.length > 0;
      let playerCount = 0;

      if (isPartyHunt) {
        playerCount = playerMatches.length;
        grossProfit = grossProfit / playerCount;
      }

      return {
        date,
        grossProfit: String(grossProfit),
      };
    } else {
      console.error(
        "Could not find date or balance in the provided session data."
      );
      return null;
    }
  } catch (error) {
    console.error("An error occurred during data extraction:", error);
    return null;
  }
}
