import { headers } from "next/headers";
import { CharacterHeader } from "@/components/characters/character-header";

export default async function CharacterProfile() {
  const name = headers().get("referer")?.split("/").pop();
  const characterData = await fetch(
    `http://localhost:3000/api/get-character-data?name=${name}`,
    { next: { revalidate: 1 } }
  ).then((res) => res.json());

  return (
    <div className="my-28">
      <CharacterHeader
        name={characterData.characterInfo.name}
        level={characterData.characterInfo.level}
        vocation={characterData.characterInfo.vocation}
      />
    </div>
  );
}
