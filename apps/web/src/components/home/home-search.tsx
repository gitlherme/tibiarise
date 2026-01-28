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
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
/* ... imports */

const formSchema = searchBarSchema;

export function HomeSearch({ locale }: { locale: string }) {
  const t = useTranslations("Homepage");
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
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-[2rem] border border-border/50 shadow-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-lg font-semibold ml-2">
                  {t("form.name.label") || "Search Character"}
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      className="h-14 px-6 rounded-full border-2 bg-background/80 focus:ring-primary/50 text-lg transition-all"
                      placeholder={
                        t("form.name.placeholder") || "Character Name"
                      }
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-14 w-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all"
                  >
                    <SearchIcon className="w-6 h-6" />
                  </Button>
                </div>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
