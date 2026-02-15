"use client";
import { ExperienceByWorldTable } from "@/components/experience-by-world/experience-by-world-table";
import { SearchBarExperienceByWorld } from "@/components/experience-by-world/search-bar";
import { HydrationBoundaryCustom } from "@/components/utils/hydration-boundary";
import { Link } from "@/i18n/routing";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function ExperienceByWorld() {
  const t = useTranslations("ExperienceByWorldPage");

  return (
    <HydrationBoundaryCustom>
      <Suspense>
        <div className="container mx-auto flex flex-col gap-12 py-12 px-4 md:px-6 min-h-screen">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in duration-300"
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

          <SearchBarExperienceByWorld />
          <ExperienceByWorldTable />
        </div>
      </Suspense>
    </HydrationBoundaryCustom>
  );
}
