"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { HydrationBoundaryCustom } from "@/components/utils/hydration-boundary";
import { useTranslations } from "next-intl";
import { levelExperience } from "@/utils/level-formulae";
import moment from "moment";
import { formatNumberToLocale } from "@/utils/formatNumber";

export default function ExperienceSimulatorView() {
  const [currentLevel, setCurrentLevel] = useState("");
  const [goalLevel, setGoalLevel] = useState("");
  const [dailyExperience, setDailyExperience] = useState("");
  const [remainingDays, setRemainingDays] = useState(0);
  const t = useTranslations("ExperienceSimulatorPage");

  const formSchema = z.object({
    currentLevel: z.string(),
    goalLevel: z
      .string()
      .refine((value) => parseInt(value) > parseInt(currentLevel), {
        message: t("form.goalLevel.error"),
      }),
    dailyExperience: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLevel: "",
      goalLevel: "",
    },
  });

  const onSubmit = async (data: any) => {
    setCurrentLevel(data.currentLevel);
    setGoalLevel(data.goalLevel);
    setDailyExperience(data.dailyExperience);
  };

  useEffect(() => {
    const goalLevelExperience = levelExperience(parseInt(goalLevel));
    const currentLevelExperience = levelExperience(parseInt(currentLevel));
    const remainingExperience = goalLevelExperience - currentLevelExperience;
    const remainingDays = Math.ceil(
      remainingExperience / parseInt(dailyExperience)
    );

    setRemainingDays(remainingDays);
  }, [currentLevel, goalLevel, dailyExperience]);

  return (
    <HydrationBoundaryCustom>
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center gap-12 container py-12">
        <h2 className="text-3xl md:text-5xl font-black text-center">
          {t("title")}
        </h2>
        <h4 className="text-center">{t("description")}</h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:w-4/5 flex flex-col gap-y-4"
          >
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-end gap-4">
              <FormField
                control={form.control}
                name="currentLevel"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("form.currentLevel.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.currentLevel.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goalLevel"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("form.goalLevel.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.goalLevel.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dailyExperience"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("form.dailyExperience.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.dailyExperience.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              {t("form.submit.label")}
            </Button>
          </form>
        </Form>

        <div className="md:w-4/5">
          {remainingDays > 0 && (
            <div className="flex flex-col gap-4 text-center">
              <p>
                {t.rich("result.message", {
                  dailyExperienceHighlight: (chunks) => <b>{chunks}</b>,
                  goalLevelHighlight: (chunks) => <b>{chunks}</b>,
                  remainingExperienceHighlight: (chunks) => <b>{chunks}</b>,
                  daysHighlight: (chunks) => <b>{chunks}</b>,
                  goalLevel,
                  remainingExperience: remainingDays,
                  dailyExperience: formatNumberToLocale(
                    parseInt(dailyExperience)
                  ),
                  days: remainingDays,
                })}
              </p>
              <span>
                {t("result.estimatedDate")}:{" "}
                {moment().add(remainingDays, "d").format("DD/MM/YYYY")}
              </span>
            </div>
          )}
        </div>
      </div>
    </HydrationBoundaryCustom>
  );
}
