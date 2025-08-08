"use client";
import { useGetCharacterData } from "@/queries/character-data.queries";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { formatNumberToLocale } from "@/utils/format-number";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { ArrowDown, ArrowUp, Minus } from "@phosphor-icons/react";
import moment from "moment";

export const ProgressLog = () => {
  const t = useTranslations("CharacterPage.progressLog");
  const { data, isLoading } = useGetCharacterData();

  const experienceTable = data?.experienceTable ?? [
    {
      date: new Date(),
      experience: 0,
      level: 0,
      totalExperience: 0,
      vocationRank: "",
    },
  ];

  const experienceTableCopy = [...experienceTable];
  const weeklyExperience = experienceTable.slice(-7);

  const totalExperienceMonth = experienceTable.reduce(
    (acc, curr) => ({ experience: acc.experience + curr.experience }),
    { experience: 0 }
  ).experience;

  const lastWeekXP = weeklyExperience.reduce(
    (acc, curr) => ({ experience: acc.experience + curr.experience }),
    { experience: 0 }
  ).experience;

  const averageXPByDay = totalExperienceMonth / 30;
  const averageXPByWeek = totalExperienceMonth / 4;

  const sortedExperience = experienceTableCopy.sort(
    (a, b) => b.experience - a.experience
  );

  const totalLevels: number | undefined =
    experienceTable[0].level -
    experienceTable[experienceTable.length - 1].level;

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col-reverse md:flex-row gap-2 justify-between">
          <CardTitle>{t("title")}</CardTitle>
          <Badge className="w-fit bg-primary">{t("lastMonthLabel")}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("xpGained")}</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalExperienceMonth)}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("lastWeekXP")}</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(lastWeekXP)}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("averageXPByDay")}</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(averageXPByDay)}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("averageXPByWeek")}</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(averageXPByWeek)}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("bestXPMonth")}</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(sortedExperience[0].experience)} (
              {moment(sortedExperience[0].date).format("DD/MM/YYYY")})
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("levelsGained")}</div>
            <div
              className={clsx(
                "text-sm flex items-center gap-1",
                Math.sign(totalLevels) === 1
                  ? "text-green-500"
                  : Math.sign(totalLevels) === 0
                  ? ""
                  : "text-red-500"
              )}
            >
              {Math.sign(totalLevels) === 1 ? (
                <ArrowUp width={16} />
              ) : Math.sign(totalLevels) === 0 ? (
                <Minus width={16} />
              ) : (
                <ArrowDown width={16} />
              )}
              {totalLevels}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
