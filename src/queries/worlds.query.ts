"use client";
import { getQueryClient } from "@/components/utils/providers";
import { Worlds } from "@/models/worlds.model";
import { useQuery } from "@tanstack/react-query";

const getWorlds = async () => {
  const response = await fetch(`/api/get-worlds`);
  const data = await response.json();
  return data;
};

export const useGetWorlds = () => {
  return useQuery<Worlds>({
    queryKey: ["worlds"],
    queryFn: () => getWorlds(),
    initialData: getQueryClient().getQueryData(["character"]),
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  });
};
