"use client";

import { CharacterInformation } from "@/components/characters/character-information";
import { ExperienceTable } from "@/components/characters/character-table-experience";
import { ProgressLog } from "@/components/progress/progress-log";
import { Search } from "@/components/search/search";
import { HydrationBoundaryCustom } from "@/components/utils/hydration-boundary";
import { useGetCharacterData } from "@/queries/character-data.query";

import { Suspense } from "react";

export default function CharacterProfileView() {
  const { data, isLoading } = useGetCharacterData();
  return (
    <HydrationBoundaryCustom>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="px-4 md:px-0">
          <Search />
          {!data?.characterInfo && !isLoading ? (
            <div className="text-center">Character not found</div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <CharacterInformation />
                <ProgressLog />
              </div>
              <ExperienceTable />
            </>
          )}
        </div>
      </Suspense>
    </HydrationBoundaryCustom>
  );
}
