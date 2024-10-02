"use client";

import { useGetCharacterData } from "@/queries/character-data.query";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { formatNumberToLocale } from "@/utils/formatNumber";
import clsx from "clsx";
import { ArrowDown, ArrowUp, Equal, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

export const ProgressLog = () => {
  const t = useTranslations("CharacterPage.progressLog");
  const { data, isLoading } = useGetCharacterData();

  const experienceTable = data?.experienceTable ?? [
    {
      date: new Date(),
      expChange: 0,
      level: 0,
      totalExperience: 0,
      vocationRank: "",
    },
  ];

  const totalExperienceMonth = experienceTable.reduce(
    (acc, curr) => ({ expChange: acc.expChange + curr.expChange }),
    { expChange: 0 }
  ).expChange;

  const totalLevels: number | undefined =
    experienceTable[experienceTable.length - 1].level -
    experienceTable[0].level;

  const totalVocationRank =
    Number(experienceTable[0].vocationRank) -
    Number(experienceTable[experienceTable.length - 1].vocationRank);

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col-reverse md:flex-row gap-2 justify-between">
          <CardTitle>{t("title")}</CardTitle>
          <Badge className="w-fit">{t("lastMonthLabel")}</Badge>
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
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("vocationRank")}</div>
            <div
              className={clsx([
                "text-sm flex gap-1 items-center",
                Math.sign(totalVocationRank) === 1
                  ? "text-green-500"
                  : Math.sign(totalVocationRank) === -1
                  ? "text-red-500"
                  : "",
              ])}
            >
              {Math.sign(totalVocationRank) === 1 ? (
                <ArrowUp width={16} />
              ) : Math.sign(totalVocationRank) === 0 ? (
                <Equal width={16} />
              ) : (
                <ArrowDown width={16} />
              )}
              {totalVocationRank}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
