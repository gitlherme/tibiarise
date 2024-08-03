import { Separator } from "@radix-ui/react-separator";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const ProgressMetrics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Average XP per Day</div>
            <div className="text-sm text-muted-foreground">12,345</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Average XP per Week</div>
            <div className="text-sm text-muted-foreground">86,415</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Average XP per Month</div>
            <div className="text-sm text-muted-foreground">374,400</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Time to Next Level</div>
            <div className="text-sm text-muted-foreground">2 weeks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
