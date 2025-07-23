export function extractSessionData(sessionData: string): {
  date: Date;
  grossProfit: number;
  isPartyHunt: boolean;
  playerCount?: number;
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
        console.error("Falha ao analisar a data ou o grossProfit.");
        return null;
      }

      const playerRegex = /\n\s*([A-Za-z\s()]+)\n\s*Loot:/g;
      const playerMatches = [...sessionData.matchAll(playerRegex)];

      const isPartyHunt = playerMatches.length > 0;
      let playerCount = 0;

      if (isPartyHunt) {
        playerCount = playerMatches.length;
        grossProfit = grossProfit / playerCount;
        console.log(`Detectado Party Hunt com ${playerCount} jogadores.`);
        console.log(
          `Balanço total (${balanceString}) dividido por ${playerCount} jogadores.`
        );
      } else {
        console.log("Detectado Hunt individual.");
      }

      return {
        date,
        grossProfit,
        isPartyHunt,
        playerCount: isPartyHunt ? playerCount : undefined,
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
