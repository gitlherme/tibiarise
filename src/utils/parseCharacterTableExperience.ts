export function parseCharacterTableExperience(rawData: string) {
  const year = new Date().getFullYear();
  // Dividir os dados em blocos por data (cada bloco começa com `${year}-`)
  const dataBlocks = rawData.split(`${year}-`).slice(1);

  const data = [];
  for (const block of dataBlocks) {
    // Extrair informações de cada bloco
    const lines = block.split("\n").filter((line) => line.trim() !== "");
    const dataValue = `${year}-` + lines[0].trim();
    const expChangeString = lines[1]
      .replace(/\+/g, "")
      .replace(/,/g, "")
      .trim();
    const vocationRankString = lines[2].trim();
    const levelString = lines[3].split(" ")[0].trim();
    const totalExperienceString = lines[4].replace(/,/g, "").trim();

    // Converter para os tipos corretos e adicionar ao array
    const expChangeValue = parseInt(expChangeString, 10) || 0; // 0 se não for um número
    const vocationRankValue = parseInt(vocationRankString, 10);
    const levelValue = parseInt(levelString, 10);
    const totalExperienceValue = parseInt(totalExperienceString, 10);

    data.push({
      data: dataValue,
      expChange: expChangeValue,
      vocationRank: vocationRankValue,
      level: levelValue,
      totalExperience: totalExperienceValue,
    });
  }

  return data;
}
