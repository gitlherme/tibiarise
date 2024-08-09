'use client';

import { useGetCharacterData } from "@/queries/character-data.query";
import { HydrationBoundary, dehydrate, useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";


export default function CharacterProfile() {
  const queryClient = useQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <div className="container mx-auto">
          <CharacterProfile />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}
