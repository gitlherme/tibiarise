"use client";

import { CharacterData } from "@/models/character-data.model";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const getCharacterData = async (name: string) => {
  const data = await fetch(`/api/character/${name}`);
  const characterData = await data.json();
  return characterData;
};

export const getCharacterDataFromTibiaData = async (name: string) => {
  const data = await fetch(`https://api.tibiadata.com/v4/character/${name}`);
  const res = await data.json();

  if (!res || !res.character) {
    throw new Error("Character data not found");
  }

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
    enabled: !!name,
    retry: false,
    refetchOnWindowFocus: true,
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
