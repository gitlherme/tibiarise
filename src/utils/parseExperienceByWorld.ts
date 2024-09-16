export function parseExperienceByWorld(input: string) {
  // Dividir o input em linhas e filtrar as que não são relevantes
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const data: any = [];

  console.log(lines.length);

  lines.forEach((line) => {
    const match = line.match(
      /^(\d+)([A-Za-z\s]+?)\s{2}(\d+)\+([\d,]+)\s*(\w{2})(\w+)$/
    );

    if (match) {
      const [, rank, name, level, expChange, vocation, world] = match;

      data.push({
        name: name.trim(),
        level: parseInt(level.trim()),
        expChange: parseInt(expChange.replace(/,/g, "").trim()),
        vocation: vocation.trim(),
      });
    }
  });

  return data;
}
