import { useMutation, useQuery } from "@tanstack/react-query";

interface ProfitEntry {
  id: string;
  characterId: string;
  huntName: string;
  huntDate: string;
  profit: string;
  preyCardsUsed: string;
  boostsValue: string;
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

interface AddProfitEntryParams {
  huntName: string;
  huntDate: string;
  profit: string;
  preyCardsUsed: string;
  boostsValue: string;
  world: string;
  characterId: string;
}
export const addNewProfitEntry = async (profitEntry: AddProfitEntryParams) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/profit-manager`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...profitEntry,
        profit: parseInt(profitEntry.profit),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add new profit entry");
  }

  const newProfitEntry = await response.json();
  return newProfitEntry;
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

export const useAddProfitEntry = () => {
  return useMutation({
    mutationKey: ["addProfitEntry"],
    mutationFn: (profitEntry: AddProfitEntryParams) =>
      addNewProfitEntry(profitEntry),
    retry: false,
  });
};
