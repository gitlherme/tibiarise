"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("SupportPage");
  return (
    <div className="text-center flex flex-col gap-8">
      <h1 className="font-black text-3xl text-primary">{t("title")}</h1>
      <div className="flex flex-col gap-4">
        <p>
          {t.rich("message1", {
            character: (chunks) => (
              <Link
                className="text-primary font-bold"
                href={`https://www.tibia.com/community/?name=Rise+Donations`}
                target="_blank"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
        <p>{t("message2")}</p>
        <p>
          {t.rich("message3", {
            discord: (chunks) => (
              <Link
                className="text-primary font-bold"
                href={`https://discord.gg/BAZDE29Eyf`}
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
