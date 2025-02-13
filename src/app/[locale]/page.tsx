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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { searchBarSchema } from "../schemas/search-bar";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next/client";

const formSchema = searchBarSchema;

export default function Home() {
  const locale = getCookie("NEXT_LOCALE") || "en";
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
    <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-12">
      <h2 className="text-3xl md:text-5xl font-black text-center">
        {t("title")}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-3/6 flex items-end gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("form.name.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.name.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            <SearchIcon aria-label="Search" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
