import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";

export const HowManyTimeTo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How many time to</CardTitle>
        <CardDescription>
          Enter your goal level and see when you will achieve it
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <span className="block">
          Making 38kk exp by day, you will achieve your goal at
        </span>
        <span className="block text-5xl font-black">21/12/2024</span>
      </CardContent>
    </Card>
  );
};
