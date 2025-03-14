"use client";
import moment from "moment";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCharacterData } from "@/queries/character-data.query";
import { Skeleton } from "../ui/skeleton";
import { formatNumberToLocale } from "@/utils/format-number";
import { useTranslations } from "next-intl";

export const ExperienceTable = () => {
  const t = useTranslations("CharacterPage");
  const { data, isLoading } = useGetCharacterData();
  const characterTable = data?.experienceTable;

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[300px] mt-12" />;
  }

  if (characterTable?.length === 1) {
    return (
      <div className="mt-12 text-center">
        <span>{t("experienceTable.noExperience")}</span>
      </div>
    );
  }

  return (
    <Table className="mt-12">
      <TableHeader>
        <TableRow>
          <TableHead>{t("experienceTable.headers.date")}</TableHead>
          <TableHead>{t("experienceTable.headers.xpGain")}</TableHead>
          <TableHead>{t("experienceTable.headers.level")}</TableHead>
          <TableHead>{t("experienceTable.headers.totalExperience")}</TableHead>
          {/* <TableHead>{t("experienceTable.headers.vocationRank")}</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {characterTable?.map((day) => (
          <TableRow key={day.date}>
            <TableCell>
              {moment(day.date).subtract(1, "day").format("DD/MM/YYYY")}
            </TableCell>
            <TableCell
              className={
                Math.sign(day.experience) === 1
                  ? "text-green-500"
                  : Math.sign(day.experience) === -1
                  ? "text-red-500"
                  : ""
              }
            >
              {Math.sign(day.experience) === 1
                ? `+${formatNumberToLocale(day.experience)}`
                : Math.sign(day.experience) === 0
                ? formatNumberToLocale(day.experience)
                : `${formatNumberToLocale(day.experience)}`}
            </TableCell>
            <TableCell>{day.level}</TableCell>
            <TableCell>{formatNumberToLocale(day.totalExperience)}</TableCell>
            {/* <TableCell>{day.vocationRank}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
