"use client";
import { ExperienceByWorldTable } from "@/components/experience-by-world/experience-by-world-table";
import { SearchBarExperienceByWorld } from "@/components/experience-by-world/search-bar";
import { HydrationBoundaryCustom } from "@/components/utils/hydration-boundary";
import { Suspense } from "react";

export default function ExperienceByWorld() {
  return (
    <HydrationBoundaryCustom>
      <Suspense>
        <SearchBarExperienceByWorld />
        <ExperienceByWorldTable />
      </Suspense>
    </HydrationBoundaryCustom>
  );
}
