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
import { formatNumberToLocale } from "@/utils/format-number";
import { useTranslations } from "next-intl";
import { Goal } from "./goal";

export const CharacterInformation = () => {
  const t = useTranslations("CharacterPage");
  const { data, isLoading } = useGetCharacterData();
  // const vocationRank =
  //   data?.experienceTable[data.experienceTable.length - 1].vocationRank;
  const totalExperience = data?.experienceTable[0].totalExperience;

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[100%]" />;
  }

  const share = {
    lower: Math.ceil(Number(data!.character.level) / 1.5),
    upper: Math.floor(Number(data!.character.level) * 1.5),
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-full">
          <div className="flex gap-2 flex-col-reverse md:flex-row justify-between w-full">
            <CardTitle>{data?.character.name}</CardTitle>
            {/* <Badge className="w-fit">
              {t("vocationRankLabel", {
                // rank: vocationRank,
                vocation: vocationInitials(data!.character.vocation),
                world: data?.character.world,
              })}
            </Badge> */}
          </div>
          <CardDescription>{data?.character.vocation}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Level</div>
            <div className="text-2xl md:text-4xl font-bold">
              {data?.character.level}
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

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <span className="text-sm">{t("goal.cta.description")}</span>
          <Goal experienceTable={data!.experienceTable} />
        </div>
      </CardContent>
    </Card>
  );
};
