"use client";

import { CharacterInformation } from "@/components/characters/character-information";
import { ExperienceTable } from "@/components/characters/character-table-experience";
import { ProgressLog } from "@/components/progress/progress-log";
import { Search } from "@/components/search/search";
import { HydrationBoundaryCustom } from "@/components/utils/hydration-boundary";
import { useGetCharacterData } from "@/queries/character-data.queries";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function CharacterProfileView() {
  const t = useTranslations();
  const { data, isLoading } = useGetCharacterData();

  return (
    <HydrationBoundaryCustom>
      <Suspense fallback={<div>{t("General.loading")}</div>}>
        <div className="px-4 md:px-0 container mx-auto">
          <Search />
          {!data?.character && !isLoading ? (
            <div className="text-center">{t("CharacterPage.notFound")}</div>
          ) : (
            <>
              {data?.experienceTable && data.experienceTable.length === 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 mb-4 rounded-xl flex items-center justify-center font-medium text-sm text-center">
                  {t("CharacterPage.notTracked")}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <CharacterInformation />
                {data?.experienceTable && data.experienceTable.length > 0 && (
                  <ProgressLog />
                )}
              </div>
              {data?.experienceTable && data.experienceTable.length > 0 && (
                <ExperienceTable />
              )}
            </>
          )}
        </div>
      </Suspense>
    </HydrationBoundaryCustom>
  );
}
