"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/routing";
import { useGetCharacterData } from "@/queries/character-data.queries";
import { formatNumberToLocale } from "@/utils/format-number";
import { VerifiedIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Goal } from "./goal";

export const CharacterInformation = () => {
  const t = useTranslations("CharacterPage");
  const { data, isLoading } = useGetCharacterData();
  const totalExperience = data?.experienceTable[0].totalExperience ?? 0;
  const streak = data?.character.streak || 0;

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
          <div className="flex gap-2 flex-col-reverse md:flex-row justify-between">
            <CardTitle className="flex gap-2 items-center mb-2">
              <span>{data?.character.name}</span>
              {data?.character.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <VerifiedIcon className="text-primary" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("verifiedAt", {
                        date: new Date(
                          data?.character.verifiedAt!,
                        ).toLocaleDateString(),
                      })}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge className="w-fit text-sm text-zinc-900 bg-orange-300 cursor-default hover:bg-orange-300 hover:text-zinc-900">
                    {streak} {t("streak.label")}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {t.rich("streak.description", {
                    days: streak,
                  })}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            {t.rich("description", {
              vocation: data?.character.vocation,
              world: data?.character.world,
            })}
          </CardDescription>
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
