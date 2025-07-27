export function extractSessionData(sessionData: string): {
  date: Date;
  grossProfit: string;
  duration: number;
} | null {
  try {
    const dateMatch = sessionData.match(/From (\d{4}-\d{2}-\d{2})/);
    const balanceMatch = sessionData.match(/Balance: ([-\d,]+)/);
    const durationMatch = sessionData.match(/Session: (\d{1,2}:\d{2})/);
    console.log(durationMatch, "aaa");

    if (dateMatch && balanceMatch && durationMatch) {
      const dateString = dateMatch[1];
      const balanceString = balanceMatch[1].replace(/,/g, "");
      const durationString = durationMatch[1].replace(/h,/g, "");

      const date = new Date(dateString);
      let grossProfit = parseFloat(balanceString);
      const [hours, minutes] = durationString.split(":").map(Number);
      console.log("Parsed Duration:", hours, "hours", minutes, "minutes");
      const huntDuration = hours * 60 + minutes;

      if (isNaN(date.getTime()) || isNaN(grossProfit) || isNaN(huntDuration)) {
        console.error(
          "Falha ao analisar a data, o grossProfit ou a duração da hunt."
        );
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
        duration: huntDuration,
        grossProfit: String(grossProfit),
      };
    } else {
      console.error(
        "Não foi possível encontrar a data ou o balanço nos dados da sessão fornecidos."
      );
      return null;
    }
  } catch (error) {
    console.error("Ocorreu um erro durante a extração de dados:", error);
    return null;
  }
}
