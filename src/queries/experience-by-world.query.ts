"use client";
import { getQueryClient } from "@/components/utils/providers";
import { ExperienceByWorld } from "@/models/experience-by-world.model";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const getExperienceByWorld = async (world: string, filter: string) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/experience-by-world/${world}/${filter}`,
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
