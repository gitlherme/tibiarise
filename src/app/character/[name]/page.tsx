import { CharacterInformation } from "@/components/characters/character-information";
import { ExperienceTable } from "@/components/characters/character-table-experience";
import { ProgressLog } from "@/components/progress/progress-log";
import { Search } from "@/components/search/search";
import { HydrationBoundaryCustom } from "@/components/utils/hydration-boundary";
import { Metadata } from "next";
import Head from "next/head";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tibia Rise",
};

export default function CharacterProfile() {
  return (
    <HydrationBoundaryCustom>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="px-4 md:px-0">
          <Search />
          <div className="grid md:grid-cols-2 gap-4">
            <CharacterInformation />
            <ProgressLog />
          </div>
          <ExperienceTable />
        </div>
      </Suspense>
    </HydrationBoundaryCustom>
  );
}
