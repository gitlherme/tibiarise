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
    <div className="col-span-1 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 md:gap-6 h-full min-h-[500px]">
      {/* Main Large Card - Rising Stars */}
      <div className="col-span-1 sm:col-span-2 md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-border/50 shadow-soft bg-card/50 backdrop-blur-sm min-h-[320px] md:min-h-0 md:aspect-auto hover:border-primary/30 transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-primary opacity-20 group-hover:opacity-30 transition-all duration-500" />
        <div className="absolute inset-0 bg-[url(/four-voc.webp)] bg-cover bg-center opacity-40 dark:opacity-30 group-hover:scale-105 transition-transform duration-1000 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />

        <div className="relative z-20 p-8 h-full flex flex-col justify-between">
          <div className="transform transition-transform duration-300 group-hover:translate-x-1">
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-foreground text-glow-primary">
              {t("risingStars.title")}
            </h3>
            <p className="text-base text-muted-foreground font-medium max-w-sm">
              {t("risingStars.subtitle")}
            </p>
          </div>

          <div className="space-y-4 mt-6">
            {stats.topGainers.length > 0 ? (
              stats.topGainers.map((char, i) => (
                <div
                  key={char.id}
                  className="flex items-center justify-between bg-white/70 dark:bg-black/40 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/5 shadow-soft hover:bg-white/90 dark:hover:bg-black/60 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                        i === 0
                          ? "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 shadow-amber-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <span className="block text-base font-bold text-foreground">
                        {char.characterName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Level {char.level}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-mono text-primary font-bold whitespace-nowrap bg-primary/10 px-3 py-1 rounded-full">
                    +{char.value.toLocaleString()} XP
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground bg-background/40 rounded-xl border border-dashed border-border">
                No data available yet. Be the first!
              </div>
            )}

            <Link
              href="/experience-by-world"
              className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 mt-2 group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
            >
              {t("risingStars.cta")}{" "}
              <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Vertical Card - Top Level */}
      <div className="col-span-1 sm:col-span-1 md:col-span-2 md:row-span-2 bg-gradient-to-br from-secondary/5 to-secondary/10 relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-border/50 shadow-soft flex flex-col justify-between p-6 md:p-8 group hover:border-secondary/30 transition-all duration-500 min-h-[240px]">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] group-hover:bg-secondary/30 transition-all duration-700" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground mb-6 shadow-lg shadow-secondary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Crown className="w-7 h-7" />
          </div>

          <div className="flex-1">
            <h4 className="text-2xl font-heading font-bold text-foreground mb-2">
              {t("topLevel.title")}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("topLevel.subtitle")}
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-secondary/10">
            {stats.topLevel ? (
              <div className="transform transition-all duration-500 group-hover:translate-y-[-4px]">
                <div className="text-5xl font-black text-secondary-foreground tracking-tight text-glow-secondary">
                  {stats.topLevel.level}
                </div>
                <div className="mt-3">
                  <p className="font-bold text-lg text-foreground">
                    {stats.topLevel.characterName}
                  </p>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    {stats.topLevel.vocation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-lg font-medium text-muted-foreground">
                --
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Small Feature Card 1 - Community */}
      <div className="col-span-1 sm:col-span-1 md:col-span-3 h-32 md:h-44 bg-card/60 backdrop-blur-sm relative overflow-hidden rounded-[2rem] border border-border/50 shadow-soft p-6 md:p-8 flex flex-row items-center justify-between group hover:border-primary/50 transition-all duration-500 hover:shadow-lg">
        <div className="relative z-10">
          <h4 className="text-xl font-heading font-bold text-foreground">
            {t("community.title")}
          </h4>
          <p className="text-4xl font-black text-primary mt-2 text-glow-primary">
            {stats.totalCharacters.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            {t("community.subtitle")}
          </p>
        </div>
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
          👥
        </div>
      </div>

      {/* Small Feature Card 2 - Loot Splitter */}
      <Link
        href="/tools/loot-split"
        className="col-span-1 sm:col-span-1 md:col-span-3 h-32 md:h-44 bg-card/60 backdrop-blur-sm relative overflow-hidden rounded-[2rem] border border-border/50 shadow-soft p-6 md:p-8 flex flex-row items-center justify-between group hover:border-blue-500/50 transition-all duration-500 hover:shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="relative z-10">
          <h4 className="text-xl font-heading font-bold text-foreground group-hover:text-blue-500 transition-colors">
            {t("lootSplitter.title")}
          </h4>
          <p className="text-sm text-muted-foreground mt-2 font-medium max-w-[200px]">
            {t("lootSplitter.subtitle")}
          </p>
        </div>
        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
          <Calculator className="w-10 h-10" />
        </div>
      </Link>
    </div>
  );
}
