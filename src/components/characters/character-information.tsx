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
import { formatNumberToLocale } from "@/utils/format-number";
import { useTranslations } from "next-intl";
import { Goal } from "./goal";
import { ExperienceTableValue } from "@/models/character-data.model";
import Link from "next/link";

export const CharacterInformation = () => {
  const t = useTranslations("CharacterPage");
  const { data, isLoading } = useGetCharacterData();
  // const vocationRank =
  //   data?.experienceTable[data.experienceTable.length - 1].vocationRank;
  const totalExperience = data?.experienceTable[0].totalExperience ?? 0;

  // Get the streak of days making XP
  const valueIsZero = (el: ExperienceTableValue) => el.experience === 0;
  const streak = data?.experienceTable.findIndex(valueIsZero);

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
          <div className="flex gap-2 flex-col-reverse md:flex-row w-full justify-between">
            <CardTitle>{data?.character.name}</CardTitle>
            <Badge className="w-fit text-sm text-orange-400 bg-orange-200">
              {streak} days streak 🔥
            </Badge>
          </div>
          <CardDescription>{data?.character.vocation}</CardDescription>
          {data?.character.guild.name && (
            <Link
              className="text-sm font-bold hover:text-orange-300"
              target="_blank"
              href={`https://www.tibia.com/community/?subtopic=guilds&page=view&GuildName=${data?.character.guild.name}`}
            >
              {`${data?.character.guild.name} ${data?.character.guild.rank}`}
            </Link>
          )}
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
