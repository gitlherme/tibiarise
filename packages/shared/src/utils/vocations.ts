export const vocationInitials = (name: string) => {
  const splittedName = name.split(" ");
  return splittedName[0][0] + splittedName[1][0];
};
