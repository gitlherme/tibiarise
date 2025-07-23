"use client";
import { getQueryClient } from "@/components/utils/providers";
import { Worlds } from "@/models/worlds.model";
import { useQuery } from "@tanstack/react-query";

const getWorlds = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/worlds`, {
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
    },
  });

  const characterData = await data.json();

  return characterData;
};

export const useGetWorlds = () => {
  return useQuery<Worlds>({
    queryKey: ["worlds"],
    queryFn: () => getWorlds(),
    initialData: getQueryClient().getQueryData(["worlds"]),
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  });
};
