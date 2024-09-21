interface PlayerData {
  rank: number;
  name: string;
  level: number;
  expChange: string;
  timeOnline: string;
  vocation: string;
  world: string;
}

export function parseExperienceByWorld(input: string): PlayerData[] {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  const players: PlayerData[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    const match = line.match(
      /^(\d{1,3})(.+?)\s+(\d+)([-+][\d,]+)\s*(\d{1,2}:\d{2})??\s*([A-Z]{2})\s*(\w+)$/
    );

    if (match) {
      const [, rank, name, level, experience, timeOnline, vocation, world] =
        match;

      players.push({
        rank: parseInt(rank),
        name: name.trim(),
        level: parseInt(level),
        expChange: experience.trim(),
        timeOnline: timeOnline || "N/A",
        vocation: vocation,
        world: world,
      });
    }
  }

  return players;
}
