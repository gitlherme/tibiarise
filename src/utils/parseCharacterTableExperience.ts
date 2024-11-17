import { ExperienceTableValue } from "@/models/character-data.model";

export function parseCharacterTableExperience(rawData: string) {
  const year = new Date().getFullYear();
  // Dividir os dados em blocos por data (cada bloco começa com `${year}-`)
  const dataBlocks = rawData.split(`${year}-`).slice(1);

  const data: ExperienceTableValue[] = [];
  for (const block of dataBlocks) {
    // Extrair informações de cada bloco
    const lines = block.split("\n").filter((line) => line.trim() !== "");
    const dateValue = `${year}-` + lines[0].trim();
    const experienceString = lines[1]
      .replace(/\+/g, "")
      .replace(/,/g, "")
      .trim();
    const vocationRankString = lines[2].trim();
    const levelString = lines[3].split(" ")[0].trim();
    const totalExperienceString = lines[4].replace(/,/g, "").trim();

    // Converter para os tipos corretos e adicionar ao array
    const experienceValue = parseInt(experienceString, 10) || 0; // 0 se não for um número
    const vocationRankValue = parseInt(vocationRankString, 10);
    const levelValue = parseInt(levelString, 10);
    const totalExperienceValue = parseInt(totalExperienceString, 10);

    data.push({
      date: dateValue,
      experience: experienceValue,
      // vocationRank: vocationRankValue,
      level: levelValue,
      totalExperience: totalExperienceValue,
    });
  }

  return data;
}
