"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { useGetExperienceByWorld } from "@/queries/experience-by-world.query";
import { formatNumberToLocale } from "@/utils/format-number";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next/client";

export const ExperienceByWorldTable = () => {
  const t = useTranslations("ExperienceByWorldPage");
  const locale = getCookie("NEXT_LOCALE") || "en";
  const { data, isLoading } = useGetExperienceByWorld();

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[300px] mt-12" />;
  }

  const table = data?.topGainers;

  return (
    table && (
      <Table className="mt-12">
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>{t("table.headers.name")}</TableHead>
            <TableHead>{t("table.headers.xpGain")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table?.map((player, index) => (
            <TableRow key={player.characterName}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Link
                  className="underline"
                  target="_blank"
                  href={`/${locale}/character/${player.characterName}`}
                >
                  {player.characterName}
                </Link>
              </TableCell>

              <TableCell
                className={
                  Math.sign(player.experienceGained) === 1
                    ? "text-green-500"
                    : Math.sign(player.experienceGained) === -1
                    ? "text-red-500"
                    : ""
                }
              >
                {Math.sign(player.experienceGained) === 1
                  ? `+${formatNumberToLocale(player.experienceGained)}`
                  : Math.sign(player.experienceGained) === 0
                  ? formatNumberToLocale(player.experienceGained)
                  : `${formatNumberToLocale(player.experienceGained)}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
};
