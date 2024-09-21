"use client";
import { getQueryClient } from "@/components/utils/providers";
import { ExperienceByWorld } from "@/models/experience-by-world.model";
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

  return useQuery<ExperienceByWorld>({
    queryKey: ["world", world?.toLowerCase(), filter?.toLowerCase()],
    queryFn: () =>
      getExperienceByWorld(
        String(world).toLowerCase(),
        String(filter).toLowerCase()
      ),
    initialData: getQueryClient().getQueryData(["world", world]),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!world && !!filter,
    retry: false,
  });
};
