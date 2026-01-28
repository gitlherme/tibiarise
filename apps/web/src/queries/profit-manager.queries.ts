import { useMutation, useQuery } from "@tanstack/react-query";

export interface ProfitEntry {
  id: string;
  characterId: string;
  huntName: string;
  huntDate: string;
  huntDuration: number;
  profit: string;
  preyCardsUsed: string;
  boostsValue: string;
  tibiaCoinValue: string;
  netProfit: string;
  createdAt: string;
  updatedAt: string;
}

export const getProfitHistoryData = async (characterId: string) => {
  const data = await fetch(`/api/profit-manager/${characterId}`);

  if (!data.ok) {
    throw new Error("Failed to fetch user characters");
  }

  const profitData: ProfitEntry[] = await data.json();
  return profitData;
};

interface AddProfitEntryParams {
  huntName: string;
  huntDate: string;
  huntDuration: number;
  profit: string;
  preyCardsUsed: string;
  boostsValue: string;
  world: string;
  characterId: string;
}

const addNewProfitEntry = async (profitEntry: AddProfitEntryParams) => {
  const response = await fetch(`/api/profit-manager`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...profitEntry,
      profit: parseInt(profitEntry.profit),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add new profit entry");
  }

  const newProfitEntry = await response.json();
  return newProfitEntry;
};

const deleteProfitEntry = async (profitEntryId: string) => {
  const response = await fetch(`/api/profit-manager/${profitEntryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete profit entry");
  }

  return { success: true };
};

export const useProfitHistory = (characterId: string) => {
  return useQuery<ProfitEntry[]>({
    queryKey: ["characterProfitHistory", characterId, "profitHistory"],
    queryFn: () => getProfitHistoryData(characterId),
    enabled: !!characterId,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
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

export const useDeleteProfitEntry = () => {
  return useMutation({
    mutationKey: ["deleteProfitEntry"],
    mutationFn: (profitEntryId: string) => deleteProfitEntry(profitEntryId),
    retry: false,
  });
};
