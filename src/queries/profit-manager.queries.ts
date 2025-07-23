import { useQuery } from "@tanstack/react-query";

interface ProfitEntry {
  id: string;
  characterId: string;
  huntName: string;
  huntDate: string;
  profit: string;
  preyCardsUsed: number;
  boostsValue: number;
  tibiaCoinValue: string;
  netProfit: string;
  createdAt: string;
  updatedAt: string;
}

export const getProfitHistoryData = async (characterId: string) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/profit-manager/${characterId}/`
  );

  if (!data.ok) {
    throw new Error("Failed to fetch user characters");
  }

  const profitData = await data.json();
  return profitData;
};

export const useProfitHistory = (characterId: string) => {
  return useQuery<ProfitEntry[]>({
    queryKey: ["characterProfitHistory", characterId, "profitHistory"],
    queryFn: () => getProfitHistoryData(characterId),
    gcTime: 1000 * 60 * 60 * 12, // 12 hours
    enabled: !!characterId,
    retry: false,
  });
};
