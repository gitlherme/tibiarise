export type PlayerData = {
  name: string;
  loot: number;
  supplies: number;
  balance: number;
  damage: number;
  healing: number;
  enabled: boolean;
};

export type SessionData = {
  dateFrom: string;
  dateTo: string;
  duration: string;
  lootType: string;
  totalLoot: number;
  totalSupplies: number;
  totalBalance: number;
  players: PlayerData[];
};

export function parseSessionData(input: string): SessionData | string {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const isValid = lines.length >= 6 && lines[0].startsWith("Session data");
  if (!isValid) return "Invalid session data";

  const dateMatch = lines[0].match(/From (.*) to (.*)/);
  const durationMatch = lines[1].match(/Session: (.*)/);
  const lootTypeMatch = lines[2].match(/Loot Type: (.*)/);
  const lootMatch = lines[3].match(/Loot: ([\d,]+)/);
  const suppliesMatch = lines[4].match(/Supplies: ([\d,]+)/);
  const balanceMatch = lines[5].match(/Balance: ([\d,-]+)/);

  const players: PlayerData[] = [];
  for (let i = 6; i < lines.length; i++) {
    const nameMatch = lines[i].match(/^(.*?)(?: \(Leader\))?$/);
    if (nameMatch && nameMatch[1]) {
      const name = nameMatch[1];
      const loot = parseInt(
        (lines[++i].split(": ")[1] || "0").replace(/,/g, "")
      );
      const supplies = parseInt(
        (lines[++i].split(": ")[1] || "0").replace(/,/g, "")
      );
      const balance = parseInt(
        (lines[++i].split(": ")[1] || "0").replace(/,/g, "")
      );
      const damage = parseInt(
        (lines[++i].split(": ")[1] || "0").replace(/,/g, "")
      );
      const healing = parseInt(
        (lines[++i].split(": ")[1] || "0").replace(/,/g, "")
      );
      players.push({
        name,
        loot,
        supplies,
        balance,
        damage,
        healing,
        enabled: true,
      });
    }
  }

  return {
    dateFrom: dateMatch ? dateMatch[1] : "",
    dateTo: dateMatch ? dateMatch[2] : "",
    duration: durationMatch ? durationMatch[1] : "",
    lootType: lootTypeMatch ? lootTypeMatch[1] : "",
    totalLoot: lootMatch ? parseInt(lootMatch[1].replace(/,/g, "")) : 0,
    totalSupplies: suppliesMatch
      ? parseInt(suppliesMatch[1].replace(/,/g, ""))
      : 0,
    totalBalance: balanceMatch
      ? parseInt(balanceMatch[1].replace(/,/g, ""))
      : 0,
    players,
  };
}
