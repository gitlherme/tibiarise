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

export const ExperienceTable = () => {
  const { data, isLoading } = useGetCharacterData();
  const characterTable = data?.experienceTable;

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[300px] mt-12" />;
  }

  return (
    <Table className="mt-12">
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>XP Gain</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Total Experience</TableHead>
          <TableHead>Vocation Rank</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {characterTable?.map((day) => (
          <TableRow key={day.date}>
            <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
            <TableCell>
              {Math.sign(day.expChange) === 1
                ? `+${formatNumberToLocale(day.expChange)}`
                : Math.sign(day.expChange) === 0
                ? formatNumberToLocale(day.expChange)
                : `-${formatNumberToLocale(day.expChange)}`}
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
