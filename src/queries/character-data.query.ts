"use client";

import { getQueryClient } from "@/components/utils/providers";
import { CharacterData } from "@/models/character-data.model";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname } from "next/navigation";

export const getCharacterData = async (name: string) => {
  const { data } = await axios.get(`/api/get-character-data?name=${name}`);
  return data;
};

export const useGetCharacterData = () => {
  const pathname = usePathname();
  const name = pathname.split("/").pop();

  return useQuery<CharacterData>({
    queryKey: ["character", name?.toLowerCase()],
    queryFn: () => getCharacterData(String(name).toLowerCase()),
    initialData: getQueryClient().getQueryData(["character", name]),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!name,
    retry: false,
  });
};
