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
import { formatNumberToLocale } from "@/utils/formatNumber";
import { useGetExperienceByWorld } from "@/queries/experience-by-world.query";

export const ExperienceByWorldTable = () => {
  const { data, isLoading } = useGetExperienceByWorld();
  const table = data?.experienceTable;

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[300px] mt-12" />;
  }

  return (
    <Table className="mt-12">
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Vocation</TableHead>
          <TableHead>Level at Beginning</TableHead>
          <TableHead>XP Gain</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {table?.map((player, index) => (
          <TableRow key={player.name}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.vocation}</TableCell>
            <TableCell>{player.level}</TableCell>
            <TableCell
              className={
                Math.sign(player.expChange) === 1
                  ? "text-green-500"
                  : Math.sign(player.expChange) === -1
                  ? "text-red-500"
                  : ""
              }
            >
              {Math.sign(player.expChange) === 1
                ? `+${formatNumberToLocale(player.expChange)}`
                : Math.sign(player.expChange) === 0
                ? formatNumberToLocale(player.expChange)
                : `${formatNumberToLocale(player.expChange)}`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
