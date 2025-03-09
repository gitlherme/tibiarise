"use client";

import { Card } from "@/components/ui/card";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export default function ToolsView() {
  const locale = getCookie("NEXT_LOCALE");
  const t = useTranslations("ToolsPage");
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <h2>{t("description")}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Link href={`/${locale}/tools/loot-split`}>
          <Card className="hover:bg-tprimary/10 p-8 text-center flex items-center h-72 flex-col gap-4 transition-all ease-in hover:shadow-lg">
            <Badge className="bg-tprimary">New</Badge>
            <Image
              src="https://www.tibiawiki.com.br/images/a/ab/Bar_of_Gold.gif"
              width={64}
              height={64}
              alt="Bar of Gold Icon"
            />
            <h2 className="text-xl font-bold">{t("tools.lootSplit.title")}</h2>
            <p>{t("tools.lootSplit.description")}</p>
          </Card>
        </Link>
        <Link href={`/${locale}/tools/compare-characters`}>
          <Card className="hover:bg-tprimary/10 p-8 text-center items-center h-72 flex flex-col gap-4 transition-all ease-in hover:shadow-lg">
            <Image
              src="https://www.tibiawiki.com.br/images/f/f3/Spying_Eye.gif"
              width={64}
              height={64}
              alt="Spying Eye Icon"
            />
            <h2 className="text-xl font-bold">
              {t("tools.compareCharacters.title")}
            </h2>
            <p>{t("tools.compareCharacters.description")}</p>
          </Card>
        </Link>
        <Link href={`/${locale}/tools/experience-simulator`}>
          <Card className="hover:bg-tprimary/10 p-8 text-center items-center h-72 flex flex-col gap-4 transition-all ease-in hover:shadow-lg">
            <Image
              src="https://www.tibiawiki.com.br/images/f/f3/XP_Boost.gif"
              width={64}
              height={64}
              alt="XP Boost Icon"
            />
            <h2 className="text-xl font-bold">
              {t("tools.experienceSimulator.title")}
            </h2>
            <p>{t("tools.experienceSimulator.description")}</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
