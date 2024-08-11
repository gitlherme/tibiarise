"use client";
import { CharacterInformation } from "@/components/characters/character-information";
import { ExperienceTable } from "@/components/characters/character-table-experience";
import { ProgressLog } from "@/components/progress/progress-log";
import {
  HydrationBoundary,
  dehydrate,
  useQueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export default function CharacterProfile() {
  const queryClient = useQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <div className="container mx-auto mt-14">
          <div className="grid grid-cols-2 gap-4">
            <CharacterInformation />
            <ProgressLog />
          </div>
          <ExperienceTable />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}
