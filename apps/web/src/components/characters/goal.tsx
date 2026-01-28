"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { ExperienceTableValue } from "@/models/character-data.model";
import { formatNumberToLocale } from "@/utils/format-number";
import { levelExperience } from "@/utils/level-formulae";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next/client";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface GoalProps {
  experienceTable: ExperienceTableValue[];
}

export const Goal = ({ experienceTable }: GoalProps) => {
  const locale = getCookie("NEXT_LOCALE") || "en";
  const t = useTranslations("CharacterPage");
  const [showMessage, setShowMessage] = useState(false);
  const [goalLevel, setGoalLevel] = useState(0);
  const [remainingExperience, setRemainingExperience] = useState(0);
  const [days, setDays] = useState(0);
  const formSchema = z.object({
    level: z
      .string()
      .refine((value) => Number(value) >= experienceTable[0].level, {
        message: t("goal.form.level.error"),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "",
    },
  });

  const totalExperience = experienceTable[0].totalExperience;

  const monthlyExperience = experienceTable.reduce(
    (acc, curr) => ({ experience: acc.experience + curr.experience }),
    { experience: 0 },
  ).experience;

  console.log(experienceTable.length);
  const dailyExperience = monthlyExperience / experienceTable.length;

  const onSubmit = (data: any) => {
    const goalLevelExperience = levelExperience(parseInt(data.level));
    const remainingExperience = goalLevelExperience - totalExperience;
    const remainingDays = Math.ceil(remainingExperience / dailyExperience);

    setGoalLevel(parseInt(data.level));
    setDays(remainingDays);
    setRemainingExperience(remainingExperience);
    setShowMessage(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary hover:brightness-110">
          {t("goal.cta.label")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("goal.title")}</DialogTitle>
          <DialogDescription>{t("goal.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
              >
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("goal.form.level.label")}</FormLabel>
                      <FormControl>
                        <Input
                          className="ring-primary"
                          placeholder={t("goal.form.level.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="bg-primary hover:bg-primary hover:brightness-110"
                  type="submit"
                >
                  {t("goal.form.submit.label")}
                </Button>
              </form>
            </Form>
          </div>
          {showMessage && (
            <div className="flex flex-col gap-4 my-4">
              <p>
                {t.rich("goal.result.message", {
                  dailyExperienceHighlight: (chunks) => <b>{chunks}</b>,
                  goalLevelHighlight: (chunks) => <b>{chunks}</b>,
                  remainingExperienceHighlight: (chunks) => <b>{chunks}</b>,
                  daysHighlight: (chunks) => <b>{chunks}</b>,
                  goalLevel,
                  remainingExperience:
                    formatNumberToLocale(remainingExperience),
                  dailyExperience: formatNumberToLocale(dailyExperience),
                  days,
                })}
              </p>

              <hr />

              <span>
                {t("goal.result.estimatedDate")}:{" "}
                {moment().add(days, "d").format("DD/MM/YYYY")}
              </span>

              <hr />

              <span className="text-center text-sm">
                {t.rich("goal.disclaimer.message", {
                  simulator: (chunks) => (
                    <Link
                      href={`/${locale}/experience-simulator`}
                      className="font-bold underline"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
