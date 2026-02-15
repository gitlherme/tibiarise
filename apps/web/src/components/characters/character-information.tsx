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
    <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm shadow-soft transition-all duration-500 hover:border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
      <CardHeader className="flex flex-row items-center gap-4 relative z-10 pb-8">
        <div className="w-full">
          <div className="flex gap-2 flex-col-reverse md:flex-row justify-between items-start md:items-center">
            <CardTitle className="flex gap-3 items-center mb-2">
              <span className="text-3xl font-heading font-bold text-foreground">
                {data?.character.name}
              </span>
              {data?.character.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <VerifiedIcon className="text-primary w-6 h-6 animate-pulse" />
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
                  <Badge className="w-fit text-sm font-bold text-warning-foreground bg-gradient-to-r from-warning/60 to-warning cursor-default hover:from-warning/70 hover:to-warning border-0 shadow-warning/20 shadow-lg transition-all duration-300">
                    {streak} {t("streak.label")} 🔥
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
          <CardDescription className="text-base font-medium text-muted-foreground mt-1">
            {t.rich("description", {
              vocation: data?.character.vocation,
              world: data?.character.world,
            })}
          </CardDescription>
          {data?.character.guild.name && (
            <Link
              className="text-sm font-bold text-primary/80 hover:text-primary mt-2 inline-block transition-colors"
              target="_blank"
              href={`https://www.tibia.com/community/?subtopic=guilds&page=view&GuildName=${data?.character.guild.name}`}
            >
              🛡️ {`${data?.character.guild.name} ${data?.character.guild.rank}`}
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-8 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 p-6 bg-background/40 rounded-2xl border border-border/50">
          <div className="grid gap-1">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Level
            </div>
            <div className="text-4xl md:text-5xl font-black text-foreground">
              {data?.character.level}
            </div>
          </div>
          <div className="grid gap-1 md:text-right">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Experience
            </div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-primary">
              {formatNumberToLocale(totalExperience!)}
            </div>
          </div>
        </div>
        <span className="text-sm px-2 text-muted-foreground">
          {t.rich("shareInfo", {
            lower: (chunks) => <b className="text-foreground">{chunks}</b>,
            upper: (chunks) => <b className="text-foreground">{chunks}</b>,
            min: share.lower,
            max: share.upper,
          })}
        </span>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-secondary/5 p-4 rounded-xl border border-secondary/10">
          <span className="text-sm font-medium text-foreground">
            {t("goal.cta.description")}
          </span>
          <div className="flex-1 w-full md:w-auto">
            <Goal experienceTable={data!.experienceTable} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
