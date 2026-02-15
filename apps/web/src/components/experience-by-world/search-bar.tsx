"use client";
import { ByWorldFilter } from "@/models/experience-by-world.model";
import { useGetWorlds } from "@/queries/worlds.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next/client";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  filter: z.enum(["DAY", "WEEK", "MONTH"]),
});

export const SearchBarExperienceByWorld = () => {
  const locale = getCookie("NEXT_LOCALE") || "en";
  const t = useTranslations("ExperienceByWorldPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: searchParams.get("world") || "",
      filter: "DAY",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    router.push(
      `/${locale}/world?world=${data.name}&filter=${ByWorldFilter[data.filter]}`,
    );
  };

  const { data, isLoading: worldsIsLoading } = useGetWorlds();

  return worldsIsLoading ? (
    <div className="w-full h-40 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ) : (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground text-glow-primary">
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>

      <div className="w-full bg-card/60 backdrop-blur-md border border-border/50 shadow-soft p-6 md:p-8 rounded-[2rem] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative z-10 flex flex-col gap-4 md:flex-row md:gap-6 md:items-end"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full md:flex-1">
                  <FormLabel className="text-foreground/80 font-medium ml-1">
                    {t("form.world.label")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 w-full bg-background/50 border-border/50 focus:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                        <SelectValue placeholder="Select World" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {data?.worlds.map((world) => (
                        <SelectItem
                          key={world}
                          value={world}
                          className="cursor-pointer"
                        >
                          {world}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="filter"
              render={({ field }) => (
                <FormItem className="w-full md:w-48">
                  <FormLabel className="text-foreground/80 font-medium ml-1">
                    {t("form.filter.label")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 w-full bg-background/50 border-border/50 focus:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DAY" className="cursor-pointer">
                        {t("form.filter.options.yesterday")}
                      </SelectItem>
                      <SelectItem value="WEEK" className="cursor-pointer">
                        {t("form.filter.options.week")}
                      </SelectItem>
                      <SelectItem value="MONTH" className="cursor-pointer">
                        {t("form.filter.options.month")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              aria-label={t("form.submit.label")}
              className="h-12 w-full md:w-auto rounded-xl bg-primary hover:bg-primary/90 hover:glow-primary shadow-soft-primary transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 gap-2"
            >
              <SearchIcon className="w-5 h-5" />
              <span className="md:sr-only">{t("form.submit.label")}</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
