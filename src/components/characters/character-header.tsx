import { Badge } from "../ui/badge";

type CharacterHeaderProps = {
  name: string;
  vocation: keyof typeof vocationIcon;
  level: number;
  rank: number;
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
  rank,
}: CharacterHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-6xl">{name}</h2>
        <div className="flex gap-8 text-xl">
          <h3>{vocationIcon[vocation] + vocation}</h3>
          <h4>Level {level}</h4>
        </div>
      </div>

      <div>
        <Badge className="">
          TOP {rank} {vocation}
        </Badge>
      </div>
    </div>
  );
};
