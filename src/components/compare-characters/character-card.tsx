import { CharacterData } from "@/models/character-data.model";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatNumberToLocale } from "@/utils/format-number";
import { useTranslations } from "next-intl";

interface CharacterCardProps {
  character: CharacterData;
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
  const t = useTranslations("CompareCharactersPage");
  const characterInfo = character?.character ?? {
    name: "",
    level: 0,
    deaths: [],
  };
  const experienceTable = character?.experienceTable ?? [
    {
      date: new Date(),
      experience: 0,
      level: 0,
      totalExperience: 0,
      vocationRank: "",
      deaths: [],
    },
  ];

  const totalExperienceMonth = experienceTable.reduce(
    (acc, curr) => ({ experience: acc.experience + curr.experience }),
    { experience: 0 }
  ).experience;

  const totalLevels: number | undefined =
    experienceTable[experienceTable.length - 1].level -
    experienceTable[0].level;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{characterInfo.name}</CardTitle>
        <div className="grid">
          <div className="text-sm font-medium">{t("card.level")}</div>
          <div className="text-2xl font-bold">{characterInfo.level}</div>
        </div>
        <div className="grid">
          <div className="text-sm font-medium">{t("card.experience")}</div>
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
          <h3 className="font-bold">{t("card.lastMonthLabel")}</h3>

          <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">{t("card.xpGained")}</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalExperienceMonth)}
            </div>
          </div>

          <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">{t("card.levelsGained")}</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalLevels)}
            </div>
          </div>

          <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">{t("card.medianXPByDay")}</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalExperienceMonth / 30)}
            </div>
          </div>

          <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">
              {t("card.medianXPByWeek")}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalExperienceMonth / 7)}
            </div>
          </div>

          {/* <div className="gap-2 flex justify-between">
            <div className="text-sm font-medium">{t("card.deaths")}</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(characterInfo.deaths.length)}
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};
