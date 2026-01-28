"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight, Calculator, Crown } from "lucide-react";
import { useTranslations } from "next-intl";

interface BentoGridProps {
  stats: {
    topGainers: {
      id: string;
      characterName: string;
      value: number;
      level: number;
    }[];
    topLevel: {
      characterName: string;
      level: number;
      vocation: string;
    } | null;
    totalCharacters: number;
  };
}

export function BentoGrid({ stats }: BentoGridProps) {
  const t = useTranslations("Homepage.Bento");

  return (
    <div className="col-span-1 lg:col-span-7 grid grid-cols-2 md:grid-cols-6 gap-4 h-full min-h-[500px]">
      {/* Main Large Card - Rising Stars */}
      <div className="col-span-2 md:col-span-4 row-span-2 relative group overflow-hidden rounded-[2rem] border border-border/50 shadow-sm bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 mix-blend-multiply z-10 opacity-60 transition-opacity group-hover:opacity-70 dark:opacity-40" />
        <div className="absolute inset-0 bg-[url(/four-voc.webp)] bg-cover bg-center opacity-30 dark:opacity-40 group-hover:scale-105 transition-transform duration-700" />

        <div className="relative z-20 p-8 h-full flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-heading font-bold mb-2 text-foreground">
              {t("risingStars.title")}
            </h3>
            <p className="text-muted-foreground font-medium">
              {t("risingStars.subtitle")}
            </p>
          </div>

          <div className="space-y-3 mt-4">
            {stats.topGainers.length > 0 ? (
              stats.topGainers.map((char, i) => (
                <div
                  key={char.id}
                  className="flex items-center justify-between bg-white/70 dark:bg-black/40 backdrop-blur-md p-3 rounded-xl border border-border/20 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0
                          ? "bg-amber-400 text-amber-900"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="font-semibold text-foreground">
                      {char.characterName}
                    </span>
                  </div>
                  <div className="text-sm font-mono text-primary font-bold">
                    +{char.value.toLocaleString()} XP
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground bg-background/40 rounded-xl">
                No data available yet. Be the first!
              </div>
            )}

            <Link
              href="/experience-by-world"
              className="inline-flex items-center text-sm font-semibold text-primary hover:underline mt-2 group-hover:translate-x-1 transition-transform"
            >
              {t("risingStars.cta")} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Vertical Card - Top Level */}
      <div className="col-span-1 md:col-span-2 row-span-2 bg-secondary/10 relative overflow-hidden rounded-[2rem] border border-border/50 shadow-sm flex flex-col justify-between p-6 group">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl group-hover:bg-secondary/30 transition-all" />
        <div className="space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground mb-4 shadow-lg shadow-secondary/20">
            <Crown className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-heading font-bold text-foreground">
            {t("topLevel.title")}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t("topLevel.subtitle")}
          </p>

          <div className="mt-8 pt-8 border-t border-border/50">
            {stats.topLevel ? (
              <>
                <div className="text-4xl font-black text-secondary-foreground tracking-tight">
                  {stats.topLevel.level}
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-foreground">
                    {stats.topLevel.characterName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.topLevel.vocation}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-lg font-medium text-muted-foreground">
                --\
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Small Feature Card 1 - Community */}
      <div className="col-span-1 md:col-span-3 h-40 bg-card relative overflow-hidden rounded-[2rem] border border-border/50 shadow-sm p-6 flex flex-row items-center justify-between group hover:border-primary/50 transition-colors">
        <div>
          <h4 className="text-lg font-heading font-bold text-foreground">
            {t("community.title")}
          </h4>
          <p className="text-3xl font-black text-primary mt-1">
            {stats.totalCharacters.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("community.subtitle")}
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl group-hover:scale-110 transition-transform">
          👥
        </div>
      </div>

      {/* Small Feature Card 2 - Loot Splitter */}
      <Link
        href="/tools/loot-split"
        className="col-span-1 md:col-span-3 h-40 bg-card relative overflow-hidden rounded-[2rem] border border-border/50 shadow-sm p-6 flex flex-row items-center justify-between group hover:border-blue-500/50 transition-colors cursor-pointer"
      >
        <div>
          <h4 className="text-lg font-heading font-bold text-foreground">
            {t("lootSplitter.title")}
          </h4>
          <p className="text-xs text-muted-foreground">
            {t("lootSplitter.subtitle")}
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 text-2xl group-hover:scale-110 transition-transform">
          <Calculator className="w-8 h-8" />
        </div>
      </Link>
    </div>
  );
}
