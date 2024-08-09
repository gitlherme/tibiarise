'use client';

import { getQueryClient } from "@/components/utils/providers";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

const getCharacterData = (name: string) => {
  const response = fetch(
    `http://localhost:3000/api/get-character-data?name=${name}`
  ).then((res) => res.json())

  return response;
}

export const useGetCharacterData = () => {
  const pathname = usePathname();
  const name = pathname.split('/').pop()

  return useQuery({
    queryKey: ["character", name?.toLowerCase()],
    queryFn: () => getCharacterData(String(name).toLowerCase()),
    initialData: getQueryClient().getQueryData(["pokemon", name]),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!name,
    retry: false,
  });
};