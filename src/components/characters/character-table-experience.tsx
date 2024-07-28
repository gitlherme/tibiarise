import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ExperienceTableProps = {
  characterTable: {
    data: string;
    expChange: number;
    vocationRank: number;
    level: number;
    totalExperience: number;
  }[];
};

export const ExperienceTable = ({ characterTable }: ExperienceTableProps) => {
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
        {characterTable.map((day) => (
          <TableRow key={day.data}>
            <TableCell>{day.data}</TableCell>
            <TableCell>
              {Math.sign(day.expChange) === 1
                ? `+${day.expChange}`
                : Math.sign(day.expChange) === 0
                ? day.expChange
                : `-${day.expChange}`}
            </TableCell>
            <TableCell>{day.level}</TableCell>
            <TableCell>{day.totalExperience}</TableCell>
            <TableCell>{day.vocationRank}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
