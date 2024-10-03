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
import { useCompareCharacters } from "@/queries/compare-characters.query";
import { useState } from "react";
import { CharacterCard } from "@/components/compare-characters/character-card";
import { XIcon } from "lucide-react";
import { HydrationBoundaryCustom } from "@/components/utils/hydration-boundary";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  firstCharacter: z.string(),
  secondCharacter: z.string(),
});

export default function CompareCharactersView() {
  const [firstCharacter, setFirstCharacter] = useState("");
  const [secondCharacter, setSecondCharacter] = useState("");
  const {
    data: characters,
    isLoading,
    isError,
  } = useCompareCharacters({
    firstCharacter,
    secondCharacter,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstCharacter: "",
      secondCharacter: "",
    },
  });

  const onSubmit = async (data: any) => {
    setFirstCharacter(data.firstCharacter);
    setSecondCharacter(data.secondCharacter);
  };

  const t = useTranslations("CompareCharactersPage");

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
            className="w-full md:w-3/5 flex flex-col gap-y-4"
          >
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-end gap-4">
              <FormField
                control={form.control}
                name="firstCharacter"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("form.name.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.name.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <XIcon width={32} className="h-10 w-10" />
              <FormField
                control={form.control}
                name="secondCharacter"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("form.name.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.name.placeholder")}
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

        {isLoading ? (
          <div>{t("loading")}</div>
        ) : isError ? (
          <div>{t("error")}</div>
        ) : (
          characters && (
            <div className="flex flex-col lg:flex-row gap-8 w-full lg:w-3/5 justify-between">
              <CharacterCard character={characters?.firstCharacter} />
              <CharacterCard character={characters?.secondCharacter} />
            </div>
          )
        )}
      </div>
    </HydrationBoundaryCustom>
  );
}
