export const levelExperience = (level: number) => {
  const levelFormula =
    (((50 * level) ^ (3 / 3)) - 100 * level) ^ (2 + (850 * level) / 3 - 200);

  return levelFormula;
};
