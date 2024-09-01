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
import { formatNumberToLocale } from "@/utils/formatNumber";
import { useEffect, useState } from "react";
import { ExperienceTableValue } from "@/models/character-data.model";

export const ExperienceTable = () => {
  const [reversedTable, setReversedTable] = useState<ExperienceTableValue[]>(
    []
  );
  const { data, isLoading } = useGetCharacterData();
  const characterTable = data?.experienceTable;

  useEffect(() => {
    if (characterTable) {
      setReversedTable(characterTable.reverse());
    }
  }, [data, characterTable]);

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[300px] mt-12" />;
  }

  return (
    <Table className="mt-12">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>XP Gain</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Total Experience</TableHead>
          <TableHead>Vocation Rank</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reversedTable?.map((day) => (
          <TableRow key={day.date}>
            <TableCell>{moment(day.date).format("L")}</TableCell>
            <TableCell
              className={
                Math.sign(day.expChange) === 1
                  ? "text-green-500"
                  : Math.sign(day.expChange) === -1
                  ? "text-red-500"
                  : ""
              }
            >
              {Math.sign(day.expChange) === 1
                ? `+${formatNumberToLocale(day.expChange)}`
                : Math.sign(day.expChange) === 0
                ? formatNumberToLocale(day.expChange)
                : `${formatNumberToLocale(day.expChange)}`}
            </TableCell>
            <TableCell>{day.level}</TableCell>
            <TableCell>{formatNumberToLocale(day.totalExperience)}</TableCell>
            <TableCell>{day.vocationRank}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
