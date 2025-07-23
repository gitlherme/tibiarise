"use client";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetWorlds } from "@/queries/worlds.queries";
import { useRouter, useSearchParams } from "next/navigation";
import { ByWorldFilter } from "@/models/experience-by-world.model";
import { getCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  filter: z.enum(["DAY", "WEEK", "MONTH"]),
});

export const SearchBarExperienceByWorld = () => {
  const locale = getCookie("NEXT_LOCALE") || "en";
  const tg = useTranslations("General");
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
      `/${locale}/world?world=${data.name}&filter=${ByWorldFilter[data.filter]}`
    );
  };

  const { data, isLoading: worldsIsLoading } = useGetWorlds();

  return worldsIsLoading ? (
    <div>{tg("loading")}</div>
  ) : (
    <div className={`flex flex-col justify-center items-center`}>
      <h2 className="text-4xl md:text-5xl font-black text-center my-4">
        {t("title")}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full xl:w-3/6 flex flex-col md:flex-row md:items-end gap-4"
        >
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full md:w-3/4">
                  <FormLabel>{t("form.world.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="World" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.worlds.map((world) => (
                        <SelectItem key={world} value={world}>
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
                <FormItem className="w-full md:w-1/4">
                  <FormLabel>{t("form.filter.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Yesterday" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DAY">
                        {t("form.filter.options.yesterday")}
                      </SelectItem>
                      <SelectItem value="WEEK">
                        {t("form.filter.options.week")}
                      </SelectItem>
                      <SelectItem value="MONTH">
                        {t("form.filter.options.month")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">
            <SearchIcon aria-label="Search" />
          </Button>
        </form>
      </Form>
    </div>
  );
};
