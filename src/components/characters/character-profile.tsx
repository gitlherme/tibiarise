import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type CharacterInformationProps = {
  name: string;
  vocation: string;
  level: number;
  totalXP: number;
  totalOnline: number;
};

export const CharacterInformation = ({
  name,
  vocation,
  level,
  totalOnline,
  totalXP,
}: CharacterInformationProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="grid gap-1">
          <div className="flex gap-8">
            <CardTitle>{name}</CardTitle>
            <Badge>Top 10 MS de Yubra</Badge>
          </div>
          <CardDescription>{vocation}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Level</div>
          <div className="text-4xl font-bold">{level}</div>
        </div>
        <div className="grid gap-2">
          <div className="text-sm font-medium">XP</div>
          <div className="text-4xl font-bold">{totalXP.toLocaleString()}</div>
        </div>
        <div className="grid gap-2">
          <div className="text-sm font-medium">Online Time</div>
          <div className="text-4xl font-bold">{totalOnline}</div>
        </div>
      </CardContent>
    </Card>
  );
};
