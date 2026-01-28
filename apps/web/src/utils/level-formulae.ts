export const levelExperience = (level: number) => {
  return (
    (50 * Math.pow(level, 3)) / 3 -
    100 * Math.pow(level, 2) +
    (850 * level) / 3 -
    200
  );
};
