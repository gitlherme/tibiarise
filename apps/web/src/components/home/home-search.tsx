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
import { Loader2, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
/* ... imports */

const formSchema = searchBarSchema;

export function HomeSearch({ locale }: { locale: string }) {
  const t = useTranslations("Homepage");
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: any) => {
    setIsSearching(true);
    router.push(`/${locale}/character/${data.name}`);
  };

  return (
    <div className="bg-card/30 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 relative z-10"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-xl font-heading font-bold ml-2 text-foreground/90">
                  {t("form.name.label") || "Search Character"}
                </FormLabel>
                <div className="flex gap-3 relative">
                  <FormControl>
                    <Input
                      className="h-16 px-8 rounded-full border-2 border-white/10 bg-background/60 focus:bg-background/90 focus:border-primary/50 focus:ring-primary/20 text-xl transition-all duration-300 placeholder:text-muted-foreground/50 shadow-inner"
                      placeholder={
                        t("form.name.placeholder") || "Character Name"
                      }
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isSearching}
                    aria-label="Search character"
                    className="h-16 w-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:glow-primary shadow-soft-primary transition-all duration-300 absolute right-0 top-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {isSearching ? (
                      <Loader2 className="w-7 h-7 animate-spin" />
                    ) : (
                      <SearchIcon className="w-7 h-7" />
                    )}
                  </Button>
                </div>
                <FormMessage className="ml-4 font-medium" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
