import { headers } from "next/headers";
import { CharacterHeader } from "@/components/characters/character-header";
import { parseCharacterTableExperience } from "@/utils/parseCharacterTableExperience";
import sanitize from "sanitize-html";
import { ExperienceTable } from "@/components/characters/character-table-experience";

export default async function CharacterProfile() {
  const name = headers().get("referer")?.split("/").pop();
  const characterData = await fetch(
    `http://localhost:3000/api/get-character-data?name=${name}`,
    { next: { revalidate: 1 } }
  ).then((res) => res.json());

  const characterTable = parseCharacterTableExperience(
    sanitize(await characterData.experienceTable)
  );

  console.log(characterTable);

  return (
    <div className="my-12">
      <CharacterHeader
        name={characterData.characterInfo.name}
        level={characterData.characterInfo.level}
        vocation={characterData.characterInfo.vocation}
        rank={characterTable[characterTable.length - 1].vocationRank}
      />
      <ExperienceTable characterTable={characterTable} />
    </div>
  );
}
