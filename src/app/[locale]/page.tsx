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
import { ArrowDown, SearchIcon } from "lucide-react";
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
    <div className="w-full h-[70vh] md:h-[55vh] flex flex-col justify-center items-center gap-12">
      <div
        className={`bg-[url(/four-voc.webp)] relative bg-cover bg-center h-full md:h-[520px] lg:rounded-lg`}
      >
        <div className="w-full md:p-24 xl:p-36 h-full bg-black/50 flex flex-col justify-center items-center lg:rounded-lg text-white">
          <div className="w-full flex flex-col gap-2 justify-center items-center">
            <h2 className="text-3xl md:text-5xl font-black text-center">
              {t("title")}
            </h2>
            <h3 className="md:text-2xl text-center">{t("subtitle")}</h3>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center bottom-2 absolute">
            <p className="text-center">{t("description")}</p>
            <span className="animate-bounce">
              <ArrowDown className="w-8 h-8" />
            </span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-3/6 flex justify-center gap-2 z-10 items-end"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-4/6 gap-2 flex flex-col ">
                <FormLabel className="text-md">
                  {t("form.name.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    className=" border-2 focus-visible:ring-tprimary bg-background text-sm text-muted-foreground rounded-full"
                    placeholder={t("form.name.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-tprimary hover:bg-tprimary hover:brightness-110 cursor-pointer rounded-full hover:rounded-full"
          >
            <SearchIcon aria-label="Search" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
