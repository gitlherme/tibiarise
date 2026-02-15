"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("SupportPage");
  return (
    <div className="container mx-auto py-12 px-4 min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-2xl w-full bg-card/40 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-soft text-center space-y-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 inline-block">
            {t("title")}
          </h1>
          <div className="h-1 w-20 bg-primary/20 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col gap-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            {t.rich("message1", {
              character: (chunks) => (
                <Link
                  className="text-primary font-bold hover:underline hover:text-primary/80 transition-colors"
                  href={`https://www.tibia.com/community/?name=Rise+Donations`}
                  target="_blank"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <p>{t("message2")}</p>
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <p className="font-medium text-foreground">
              {t.rich("message3", {
                discord: (chunks) => (
                  <Link
                    className="text-primary font-bold hover:underline hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                    href={`https://discord.gg/BAZDE29Eyf`}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
