"use client";
import { useGetCharacterData } from "@/queries/character-data.query";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { vocationInitials } from "@/utils/vocations";
import { formatNumberToLocale } from "@/utils/formatNumber";
import { useTranslations } from "next-intl";
import { Goal } from "./goal";

export const CharacterInformation = () => {
  const t = useTranslations("CharacterPage");
  const { data, isLoading } = useGetCharacterData();
  const vocationRank =
    data?.experienceTable[data.experienceTable.length - 1].vocationRank;
  const totalExperience =
    data?.experienceTable[data.experienceTable.length - 1].totalExperience;

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[100%]" />;
  }

  const share = {
    lower: Math.ceil(data!.characterInfo.level / 1.5),
    upper: Math.floor(data!.characterInfo.level * 1.5),
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-full">
          <div className="flex gap-2 flex-col-reverse md:flex-row justify-between w-full">
            <CardTitle>{data?.characterInfo.name}</CardTitle>
            <Badge className="w-fit">
              {t("vocationRankLabel", {
                rank: vocationRank,
                vocation: vocationInitials(data!.characterInfo.vocation),
                world: data?.characterInfo.world,
              })}
            </Badge>
          </div>
          <CardDescription>{data?.characterInfo.vocation}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Level</div>
            <div className="text-2xl md:text-4xl font-bold">
              {data?.characterInfo.level}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-medium">XP</div>
            <div className="text-2xl md:text-4xl font-bold">
              {formatNumberToLocale(totalExperience!)}
            </div>
          </div>
        </div>
        <span className="text-sm mt-2">
          {t.rich("shareInfo", {
            lower: (chunks) => <b>{chunks}</b>,
            upper: (chunks) => <b>{chunks}</b>,
            min: share.lower,
            max: share.upper,
          })}
        </span>

        <div className="flex justify-between items-center">
          <span>{t("goal.cta.description")}</span>
          <Goal experienceTable={data!.experienceTable} />
        </div>
      </CardContent>
    </Card>
  );
};
