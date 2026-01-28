"use client";

import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Coins,
  LineChart,
  Scale,
  Search,
  Timer,
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
            className="group p-8 rounded-[2rem] bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 flex flex-col items-start text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3 text-foreground flex items-center gap-2">
              {feature.title}
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
