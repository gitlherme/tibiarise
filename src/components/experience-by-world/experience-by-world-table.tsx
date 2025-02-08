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
import { formatNumberToLocaleString } from "@/utils/format-number";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";

export const ExperienceByWorldTable = () => {
  const t = useTranslations("ExperienceByWorldPage");
  const locale = getCookie("NEXT_LOCALE") || "en";
  const { data, isLoading } = useGetExperienceByWorld();
  const table = data?.experienceTable;

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[300px] mt-12" />;
  }

  return (
    table && (
      <Table className="mt-12">
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>{t("table.headers.name")}</TableHead>
            <TableHead>{t("table.headers.vocation")}</TableHead>
            <TableHead>{t("table.headers.levelAtBeggining")}</TableHead>
            <TableHead>{t("table.headers.xpGain")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table?.map((player, index) => (
            <TableRow key={player.name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Link
                  className="underline"
                  target="_blank"
                  href={`/${locale}/character/${player.name}`}
                >
                  {player.name}
                </Link>
              </TableCell>
              <TableCell>{player.vocation}</TableCell>
              <TableCell>{player.level}</TableCell>
              <TableCell
                className={
                  Math.sign(player.experience) === 1
                    ? "text-green-500"
                    : Math.sign(player.experience) === -1
                    ? "text-red-500"
                    : ""
                }
              >
                {Math.sign(player.experience) === 1
                  ? `+${formatNumberToLocaleString(player.experience)}`
                  : Math.sign(player.experience) === 0
                  ? formatNumberToLocaleString(player.experience)
                  : `${formatNumberToLocaleString(player.experience)}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
};
