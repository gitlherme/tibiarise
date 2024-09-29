import { CharacterData } from "@/models/character-data.model";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatNumberToLocale } from "@/utils/formatNumber";

interface CharacterCardProps {
  character: CharacterData;
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
  const characterInfo = character?.characterInfo ?? {
    name: "",
    level: 0,
    deaths: [],
  };
  const experienceTable = character?.experienceTable ?? [
    {
      date: new Date(),
      expChange: 0,
      level: 0,
      totalExperience: 0,
      vocationRank: "",
      deaths: [],
    },
  ];

  const totalExperienceMonth = experienceTable.reduce(
    (acc, curr) => ({ expChange: acc.expChange + curr.expChange }),
    { expChange: 0 }
  ).expChange;

  const totalLevels: number | undefined =
    experienceTable[experienceTable.length - 1].level -
    experienceTable[0].level;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{characterInfo.name}</CardTitle>
        <div className="grid">
          <div className="text-sm font-medium">Level</div>
          <div className="text-2xl font-bold">{characterInfo.level}</div>
        </div>
        <div className="grid">
          <div className="text-sm font-medium">XP</div>
          <div className="text-2xl font-bold">
            {formatNumberToLocale(
              character.experienceTable[character.experienceTable.length - 1]
                .totalExperience
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <hr className="my-4" />

        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Last month status</h3>

          <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">XP Gained</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalExperienceMonth)}
            </div>
          </div>

          <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">Levels Gained</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalLevels)}
            </div>
          </div>

          <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">Median XP by day</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalExperienceMonth / 30)}
            </div>
          </div>

          <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">Median XP by week</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalExperienceMonth / 7)}
            </div>
          </div>

          <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">Deaths</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(characterInfo.deaths.length)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
