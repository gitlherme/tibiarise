"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getCookie } from "cookies-next/client";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ToolsView() {
  const locale = getCookie("NEXT_LOCALE");
  const t = useTranslations("ToolsPage");
  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-in fade-in duration-300"
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">{t("title")}</span>
      </nav>

      <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
          {t("title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Link
          href={`/tools/charm-finder`}
          className="focus-visible:outline-none"
        >
          <Card className="group relative h-full p-8 flex flex-col items-center text-center gap-6 overflow-hidden rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-md shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-sm animate-pulse">
              New
            </Badge>

            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-background/50 to-background/80 shadow-inner flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors duration-300">
              <Image
                src="/assets/charms/Carnage_Icon.gif"
                width={48}
                height={48}
                alt="Charm Finder Icon"
                className="drop-shadow-md"
              />
            </div>

            <div className="relative z-10 space-y-2">
              <h2 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                {t("tools.charmFinder.title")}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {t("tools.charmFinder.description")}
              </p>
            </div>

            <div className="mt-auto pt-4 relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-primary font-medium text-sm flex items-center gap-1">
                Open Tool <span className="text-lg">→</span>
              </span>
            </div>
          </Card>
        </Link>

        <Link href={`/tools/loot-split`} className="focus-visible:outline-none">
          <Card className="group relative h-full p-8 flex flex-col items-center text-center gap-6 overflow-hidden rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-md shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-background/50 to-background/80 shadow-inner flex items-center justify-center border border-border/50 group-hover:border-yellow-500/30 transition-colors duration-300">
              <Image
                src="/assets/Bar_of_Gold.gif"
                width={48}
                height={48}
                alt="Bar of Gold Icon"
                className="drop-shadow-md"
              />
            </div>

            <div className="relative z-10 space-y-2">
              <h2 className="text-2xl font-bold group-hover:text-yellow-500 transition-colors duration-300">
                {t("tools.lootSplit.title")}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {t("tools.lootSplit.description")}
              </p>
            </div>

            <div className="mt-auto pt-4 relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-yellow-500 font-medium text-sm flex items-center gap-1">
                Open Tool <span className="text-lg">→</span>
              </span>
            </div>
          </Card>
        </Link>

        <Link
          href={`/tools/compare-characters`}
          className="focus-visible:outline-none"
        >
          <Card className="group relative h-full p-8 flex flex-col items-center text-center gap-6 overflow-hidden rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-md shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-background/50 to-background/80 shadow-inner flex items-center justify-center border border-border/50 group-hover:border-blue-500/30 transition-colors duration-300">
              <Image
                src="/assets/Spying_Eye.webp"
                width={48}
                height={48}
                alt="Spying Eye Icon"
                className="drop-shadow-md"
              />
            </div>

            <div className="relative z-10 space-y-2">
              <h2 className="text-2xl font-bold group-hover:text-blue-500 transition-colors duration-300">
                {t("tools.compareCharacters.title")}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {t("tools.compareCharacters.description")}
              </p>
            </div>

            <div className="mt-auto pt-4 relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-blue-500 font-medium text-sm flex items-center gap-1">
                Open Tool <span className="text-lg">→</span>
              </span>
            </div>
          </Card>
        </Link>

        <Link
          href={`/tools/experience-simulator`}
          className="focus-visible:outline-none"
        >
          <Card className="group relative h-full p-8 flex flex-col items-center text-center gap-6 overflow-hidden rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-md shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-background/50 to-background/80 shadow-inner flex items-center justify-center border border-border/50 group-hover:border-green-500/30 transition-colors duration-300">
              <Image
                src="/assets/XP_Boost.webp"
                width={48}
                height={48}
                alt="XP Boost Icon"
                className="drop-shadow-md"
              />
            </div>

            <div className="relative z-10 space-y-2">
              <h2 className="text-2xl font-bold group-hover:text-green-500 transition-colors duration-300">
                {t("tools.experienceSimulator.title")}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {t("tools.experienceSimulator.description")}
              </p>
            </div>

            <div className="mt-auto pt-4 relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-green-500 font-medium text-sm flex items-center gap-1">
                Open Tool <span className="text-lg">→</span>
              </span>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
