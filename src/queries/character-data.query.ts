"use client";

import { getQueryClient } from "@/components/utils/providers";
import { CharacterData } from "@/models/character-data.model";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export const getCharacterData = async (name: string) => {
  const response = await fetch(`/api/get-character-data?name=${name}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
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
