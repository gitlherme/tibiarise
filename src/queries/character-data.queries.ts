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
