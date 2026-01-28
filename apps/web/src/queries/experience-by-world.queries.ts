"use client";
import { ExperienceByWorld } from "@/models/experience-by-world.model";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const getExperienceByWorld = async (world: string, filter: string) => {
  const data = await fetch(`/api/experience-by-world/${world}/${filter}`);

  const experienceByWorld = await data.json();

  return experienceByWorld;
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
        String(filter).toLowerCase(),
      ),
    enabled: !!world && !!filter,
    retry: false,
  });
};
