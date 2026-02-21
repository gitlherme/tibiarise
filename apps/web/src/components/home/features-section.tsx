"use client";

import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Coins,
  Eye,
  LineChart,
  Scale,
  Search,
  Timer,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturesSection() {
  const t = useTranslations("Homepage.Features");

  const features = [
    {
      icon: LineChart,
      title: t("xpTracking.title"),
      description: t("xpTracking.description"),
      href: "/dashboard",
    },
    {
      icon: Wallet,
      title: t("profitAnalytics.title"),
      description: t("profitAnalytics.description"),
      href: "/dashboard",
    },
    {
      icon: Eye,
      title: t("charmFinder.title"),
      description: t("charmFinder.description"),
      href: "/tools/charm-finder",
    },
    {
      icon: Coins,
      title: t("lootSplitter.title"),
      description: t("lootSplitter.description"),
      href: "/tools/loot-split",
    },
    {
      icon: Search,
      title: t("characterSearch.title"),
      description: t("characterSearch.description"),
      href: "/", // Focus on search by default
    },
    {
      icon: Scale,
      title: t("compareCharacters.title"),
      description: t("compareCharacters.description"),
      href: "/tools/compare-characters",
    },
    {
      icon: Timer, // Or Zap
      title: t("experienceSimulator.title"),
      description: t("experienceSimulator.description"),
      href: "/tools/experience-simulator",
    },
    {
      icon: Users,
      title: t("partyTracker.title"),
      description: t("partyTracker.description"),
      href: "/dashboard/party",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto py-24 px-6 lg:px-0">
      <div className="flex flex-col items-center text-center mb-16 space-y-4">
        <h2
          className="text-3xl md:text-5xl font-heading font-bold text-foreground"
          dangerouslySetInnerHTML={{ __html: t.raw("title") }}
        />
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <Link
            href={feature.href}
            key={idx}
            className="group p-8 rounded-[2.5rem] bg-card/60 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col items-start text-left relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-sm">
              <feature.icon className="w-8 h-8" />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-heading font-bold mb-3 text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                {feature.title}
                <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
              </h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
