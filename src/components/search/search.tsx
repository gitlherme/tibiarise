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
import { searchBarSchema } from "@/app/schemas/search-bar";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next/client";

const formSchema = searchBarSchema;

export const Search = () => {
  const locale = getCookie("NEXT_LOCALE") || "en";
  const t = useTranslations("CharacterPage");
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: any) => {
    router.push(`/${locale}/character/${data.name}`);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-4 pb-12 mt-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <div className="w-full">
              <FormItem>
                <FormLabel>{t("searchAnother.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("searchAnother.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <Button
          type="submit"
          aria-label="Search"
          className="bg-tprimary hover:bg-tprimary hover:brightness-110"
        >
          <SearchIcon />
        </Button>
      </form>
    </Form>
  );
};
