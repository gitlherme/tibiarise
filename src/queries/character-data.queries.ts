"use client";

import { getQueryClient } from "@/components/utils/providers";
import { CharacterData } from "@/models/character-data.model";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const getCharacterData = async (name: string) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/character/${name}`,
    {
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 24,
      },
    }
  );

  const characterData = await data.json();

  return characterData;
};

export const getCharacterDataFromTibiaData = async (name: string) => {
  const data = await fetch(`https://api.tibiadata.com/v4/character/${name}`);
  const res = await data.json();

  if (!res || !res.character) {
    throw new Error("Character data not found");
  }

  console.log(res);

  return {
    name: res.character.character.name,
    vocation: res.character.character.vocation,
    level: res.character.character.level,
    world: res.character.character.world,
  };
};

export const useGetCharacterData = () => {
  const pathname = usePathname();
  const name = pathname.split("/").pop();

  return useQuery<CharacterData>({
    queryKey: ["character", name?.toLowerCase()],
    queryFn: () => getCharacterData(String(name).toLowerCase()),
    initialData: getQueryClient().getQueryData(["character", name]),
    gcTime: 1000 * 60 * 60 * 12, // 1 minute
    enabled: !!name,
    retry: false,
  });
};

export const useGetCharacterDataByName = (name: string) => {
  return useQuery({
    queryKey: ["characterTibiaData", name.toLowerCase()],
    queryFn: () => getCharacterDataFromTibiaData(name.toLowerCase()),
    enabled: false,
    retry: false,
  });
};
