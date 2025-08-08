"use client";
import { Worlds } from "@/models/worlds.model";
import { useQuery } from "@tanstack/react-query";

const getWorlds = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/worlds`);
  const characterData = await data.json();
  return characterData;
};

export const useGetWorlds = () => {
  return useQuery<Worlds>({
    queryKey: ["worlds"],
    queryFn: () => getWorlds(),
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  });
};
