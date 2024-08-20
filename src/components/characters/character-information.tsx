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

export const CharacterInformation = () => {
  const { data, isLoading } = useGetCharacterData();
  const vocationRank =
    data?.experienceTable[data.experienceTable.length - 1].vocationRank;
  const totalExperience =
    data?.experienceTable[data.experienceTable.length - 1].totalExperience;

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[100%]" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-full">
          <div className="flex gap-2 flex-col-reverse md:flex-row justify-between w-full">
            <CardTitle>{data?.characterInfo.name}</CardTitle>
            <Badge className="w-fit">
              {`Top ${vocationRank} ${vocationInitials(
                data!.characterInfo.vocation
              )} de ${data?.characterInfo.world}`}
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
      </CardContent>
    </Card>
  );
};
