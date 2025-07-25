import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfitManagerCardProps {
  title: string;
  icon?: React.ReactNode;
  highlight: string;
  note?: string;
}

export const ProfitManagerCard = ({
  title,
  icon,
  highlight,
  note,
}: ProfitManagerCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-foreground">
          <span className="text-green-500">{icon}</span>
          <CardTitle className="text-lg font-sans">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{highlight}</div>
      </CardContent>
      <CardFooter>
        {note && <p className="text-sm text-muted-foreground mt-2">{note}</p>}
      </CardFooter>
    </Card>
  );
};
