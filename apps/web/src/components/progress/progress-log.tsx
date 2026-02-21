"use client";
import { useGetCharacterData } from "@/queries/character-data.queries";
import { formatNumberToLocale } from "@/utils/format-number";
import { ArrowDown, ArrowUp, Minus } from "@phosphor-icons/react";
import clsx from "clsx";
import moment from "moment";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export const ProgressLog = () => {
  const t = useTranslations("CharacterPage.progressLog");
  const { data, isLoading } = useGetCharacterData();

  const experienceTable =
    data?.experienceTable && data.experienceTable.length > 0
      ? data.experienceTable
      : [
          {
            date: new Date(),
            experience: 0,
            level: Number(data?.character?.level) || 0,
            totalExperience: 0,
            vocationRank: "",
          },
        ];

  const experienceTableCopy = [...experienceTable];
  const weeklyExperience = experienceTable.slice(0, 7);

  const totalExperienceMonth = experienceTable.reduce(
    (acc, curr) => ({ experience: acc.experience + curr.experience }),
    { experience: 0 },
  ).experience;

  const lastWeekXP = weeklyExperience.reduce(
    (acc, curr) => ({ experience: acc.experience + curr.experience }),
    { experience: 0 },
  ).experience;

  const averageXPByDay = totalExperienceMonth / experienceTable.length;
  const averageXPByWeek = totalExperienceMonth / 4;

  const sortedExperience = experienceTableCopy.sort(
    (a, b) => b.experience - a.experience,
  );

  const totalLevels: number | undefined =
    experienceTable[0].level -
    experienceTable[experienceTable.length - 1].level;

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-soft transition-all duration-500 hover:border-primary/20 flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col-reverse md:flex-row gap-2 justify-between items-center">
          <CardTitle className="font-heading text-xl">{t("title")}</CardTitle>
          <Badge className="w-fit bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
            {t("lastMonthLabel")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center gap-4 pt-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background/40 transition-colors">
            <div className="text-sm font-medium text-muted-foreground">
              {t("xpGained")}
            </div>
            <div className="text-lg font-bold text-foreground">
              {formatNumberToLocale(totalExperienceMonth)}
            </div>
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background/40 transition-colors">
            <div className="text-sm font-medium text-muted-foreground">
              {t("lastWeekXP")}
            </div>
            <div className="text-lg font-bold text-foreground">
              {formatNumberToLocale(lastWeekXP)}
            </div>
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background/40 transition-colors">
            <div className="text-sm font-medium text-muted-foreground">
              {t("averageXPByDay")}
            </div>
            <div className="text-base font-mono font-medium text-foreground">
              {formatNumberToLocale(averageXPByDay)}
            </div>
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background/40 transition-colors">
            <div className="text-sm font-medium text-muted-foreground">
              {t("averageXPByWeek")}
            </div>
            <div className="text-base font-mono font-medium text-foreground">
              {formatNumberToLocale(averageXPByWeek)}
            </div>
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background/40 transition-colors">
            <div className="text-sm font-medium text-muted-foreground">
              {t("bestXPMonth")}
            </div>
            <div className="text-sm font-medium font-mono text-success">
              +{formatNumberToLocale(sortedExperience[0].experience)}{" "}
              <span className="text-muted-foreground text-xs ml-1">
                ({moment(sortedExperience[0].date).format("DD/MM")})
              </span>
            </div>
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background/40 transition-colors">
            <div className="text-sm font-medium text-muted-foreground">
              {t("levelsGained")}
            </div>
            <div
              className={clsx(
                "text-lg font-bold flex items-center gap-1",
                Math.sign(totalLevels) === 1
                  ? "text-success"
                  : Math.sign(totalLevels) === 0
                    ? "text-muted-foreground"
                    : "text-destructive",
              )}
            >
              {Math.sign(totalLevels) === 1 ? (
                <ArrowUp width={20} weight="bold" />
              ) : Math.sign(totalLevels) === 0 ? (
                <Minus width={20} weight="bold" />
              ) : (
                <ArrowDown width={20} weight="bold" />
              )}
              {totalLevels}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
