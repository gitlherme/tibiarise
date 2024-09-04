"use client";

import { ExperienceByWorldTable } from "@/components/experience-by-world/experience-by-world-table";
import { Suspense } from "react";

export default function World() {
  return (
    <Suspense>
      <ExperienceByWorldTable />;
    </Suspense>
  );
}
