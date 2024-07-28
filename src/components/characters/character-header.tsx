type CharacterHeaderProps = {
  name: string;
  vocation: keyof typeof vocationIcon;
  level: number;
};

const vocationIcon = {
  "Royal Paladin": "🏹",
  Paladin: "🏹",
  Knight: "🛡️",
  "Elite Knight": "🛡️",
  Sorcerer: "🧙‍♂️",
  "Master Sorcerer": "🧙‍♂️",
  Druid: "🐻",
  "Elder Druid": "🐻",
};

export const CharacterHeader = ({
  name,
  vocation,
  level,
}: CharacterHeaderProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-6xl">{name}</h2>
      <div className="flex gap-8">
        <h3>{vocationIcon[vocation] + vocation}</h3>
        <h4>{level}</h4>
      </div>
    </div>
  );
};
