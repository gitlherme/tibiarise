"use client";
import { getQueryClient } from "@/components/utils/providers";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const getExperienceByWorld = async (world: string, filter: string) => {
  const response = await fetch(
    `/api/get-experience-by-world?world=${world}&filter=${filter}`
  );
  const data = await response.json();
  return data;
};

export const useGetExperienceByWorld = () => {
  const searchParams = useSearchParams();
  const world = searchParams.get("world");
  const filter = searchParams.get("filter");

  return useQuery({
    queryKey: ["world", world?.toLowerCase()],
    queryFn: () =>
      getExperienceByWorld(String(world).toLowerCase(), String(filter)),
    initialData: getQueryClient().getQueryData(["world", world]),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!world,
    retry: false,
  });
};
