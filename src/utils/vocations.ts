type Vocation = {
  name:
    | "knight"
    | "elite knight"
    | "paladin"
    | "royal paladin"
    | "sorcerer"
    | "master sorcerer"
    | "druid"
    | "elder druid";
};

export const vocationInitials = (name: string) => {
  const splittedName = name.split(" ");
  return splittedName[0][0] + splittedName[1][0];
};
