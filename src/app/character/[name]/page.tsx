import { headers } from "next/headers";
import { parseCharacterTableExperience } from "@/utils/parseCharacterTableExperience";
import sanitize from "sanitize-html";
import { ExperienceTable } from "@/components/characters/character-table-experience";
import { CharacterInformation } from "@/components/characters/character-profile";
import { ProgressMetrics } from "@/components/progress/progress-metrics";
import { HowManyTimeTo } from "@/components/how-many-time-to/how-many-time-to";

export default async function CharacterProfile() {
  const name = headers().get("referer")?.split("/").pop();
  const { experienceTable, characterInfo } = await fetch(
    `http://localhost:3000/api/get-character-data?name=${name}`,
    { next: { revalidate: 24 * 60 * 60 } }
  ).then((res) => res.json());

  const characterTable = parseCharacterTableExperience(
    sanitize(await experienceTable)
  );

  return (
    <div className="my-12">
      <div className="grid grid-cols-3 gap-8">
        <CharacterInformation
          level={characterInfo.level}
          name={characterInfo.name}
          totalOnline={123}
          totalXP={characterTable[characterTable.length - 1].totalExperience}
          vocation={characterInfo.vocation}
        />
        <ProgressMetrics />
        <HowManyTimeTo />
      </div>
      <ExperienceTable characterTable={characterTable} />
    </div>
  );
}
