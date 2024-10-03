"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CharacterData } from "@/models/character-data.model";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { levelExperience } from "@/utils/level-formulae";

interface GoalProps {
  character?: CharacterData;
}

const formSchema = z.object({
  level: z.string(),
});

export const Goal = ({ character }: GoalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "",
    },
  });

  const [levelToAchieve, setLevelToAchieve] = useState<string>();
  const [experiencePerDay, setExperiencePerDay] = useState<number>();
  const [timeToAchieveInDays, setTimeToAchieveInDays] = useState<number>();

  const onSubmit = (data: any) => {
    const totalExperienceMonth =
      character?.experienceTable.reduce(
        (acc, curr) => ({ expChange: acc.expChange + curr.expChange }),
        { expChange: 0 }
      ).expChange || 0;

    const totalExperience =
      character?.experienceTable[character.experienceTable.length - 1]
        .totalExperience;

    setExperiencePerDay(totalExperienceMonth / 30);

    const experienceLevelToAchive = levelExperience(Number(levelToAchieve));

    setTimeToAchieveInDays(
      (experienceLevelToAchive - totalExperience!) / experiencePerDay!
    );

    console.log(
      data.level,
      experienceLevelToAchive,
      experiencePerDay,
      totalExperience
    );
    setLevelToAchieve(data.level);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Set goal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set a goal</DialogTitle>
          <DialogDescription>
            What is the level that you want to achieve?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <Input placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Check</Button>
              </form>
            </Form>
          </div>

          {levelToAchieve && (
            <div>
              Currently you're doing {experiencePerDay} xp median by day. Doing
              this XP, you will achieve the level 1000 in {timeToAchieveInDays}{" "}
              days.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
