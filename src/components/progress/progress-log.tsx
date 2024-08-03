import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

export const ProgressLog = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Progress Log</CardTitle>
          <Badge>Last month</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">XP Gained</div>
            <div className="text-sm text-muted-foreground">12,345,678</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Levels Gained</div>
            <div className="text-sm text-muted-foreground">5</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Online Time</div>
            <div className="text-sm text-muted-foreground">5d 12h</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Quests Completed</div>
            <div className="text-sm text-muted-foreground">120</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
