"use client";

import { searchBarSchema } from "@/app/schemas/search-bar";
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
import { getCookie } from "cookies-next/client";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
        className="flex items-end gap-3 pb-8 mt-8 max-w-2xl mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <div className="w-full">
              <FormItem>
                <FormLabel className="text-muted-foreground ml-1">
                  {t("searchAnother.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("searchAnother.placeholder")}
                    className="h-12 rounded-full border-2 border-border/50 bg-background/50 focus:bg-background transition-all duration-300 shadow-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="ml-2" />
              </FormItem>
            </div>
          )}
        />
        <Button
          type="submit"
          aria-label="Search"
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 shadow-soft-primary transition-all duration-300 shrink-0"
        >
          <SearchIcon className="w-5 h-5" />
        </Button>
      </form>
    </Form>
  );
};
