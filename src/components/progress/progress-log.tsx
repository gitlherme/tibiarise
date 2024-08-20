"use client";

import { useGetCharacterData } from "@/queries/character-data.query";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { formatNumberToLocale } from "@/utils/formatNumber";
import clsx from "clsx";

export const ProgressLog = () => {
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
        <div className="flex justify-between">
          <CardTitle>Progress Log</CardTitle>
          <Badge>Last month</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">XP Gained</div>
            <div className="text-sm text-muted-foreground">
              {formatNumberToLocale(totalExperienceMonth)}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Levels Gained</div>
            <div className={clsx("text-sm")}>{totalLevels}</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Vocation Rank</div>
            <div
              className={clsx([
                "text-sm",
                Math.sign(totalVocationRank) === 1
                  ? "text-green-500"
                  : "text-red-500",
              ])}
            >
              {totalVocationRank}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
