"use client";
import { ExperienceByWorldTable } from "@/components/experience-by-world/experience-by-world-table";
import { SearchBarExperienceByWorld } from "@/components/experience-by-world/search-bar";
import { SharedBreadcrumb } from "@/components/shared/shared-breadcrumb";
import { HydrationBoundaryCustom } from "@/components/utils/hydration-boundary";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function ExperienceByWorld() {
  const t = useTranslations("ExperienceByWorldPage");

  return (
    <HydrationBoundaryCustom>
      <Suspense>
        <div className="container mx-auto flex flex-col gap-12 py-12 px-4 md:px-6 min-h-screen">
          {/* Breadcrumb */}
          <SharedBreadcrumb items={[{ label: t("title") }]} />

          <SearchBarExperienceByWorld />
          <ExperienceByWorldTable />
        </div>
      </Suspense>
    </HydrationBoundaryCustom>
  );
}
