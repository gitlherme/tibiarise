import { useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PartyMember {
  id: string;
  partyId: string;
  userId: string;
  characterId: string;
  isLeader: boolean;
  joinedAt: string;
  character: {
    id: string;
    name: string;
    world: string;
    level: number;
    vocation: string | null;
  };
  user: {
    id: string;
    email: string;
  };
}

export interface Party {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
  isPublic: boolean;
  inviteCode: string;
  isActive: boolean;
  maxMembers: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: PartyMember[];
  creator: {
    id: string;
    email: string;
  };
}

export interface HuntSession {
  id: string;
  partyId: string;
  huntName: string;
  huntDate: string;
  duration: number | null;
  loot: string;
  supplies: string;
  balance: string;
  rawSessionData: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartyDrop {
  id: string;
  partyId: string;
  itemName: string;
  itemId: number | null;
  quantity: number;
  value: string;
  sold: boolean;
  source: string | null;
  currency: "GOLD" | "TIBIA_COIN";
  droppedAt: string;
  createdAt: string;
}

export interface PartyBalance {
  totalLoot: string;
  totalSupplies: string;
  netBalance: string;
  totalDropsValue: string;
  totalDropsValueTc: string;
  sessionCount: number;
  dropCount: number;
}

// ─── Fetchers ───────────────────────────────────────────────────────────────

const fetchUserParties = async (): Promise<Party[]> => {
  const res = await fetch("/api/party-manager");
  if (!res.ok) throw new Error("Failed to fetch parties");
  return res.json();
};

const fetchPartyDetails = async (id: string): Promise<Party> => {
  const res = await fetch(`/api/party-manager/${id}`);
  if (!res.ok) throw new Error("Failed to fetch party");
  return res.json();
};

const fetchPartyHuntSessions = async (
  id: string,
  period?: string,
): Promise<HuntSession[]> => {
  const params = period ? `?period=${period}` : "";
  const res = await fetch(`/api/party-manager/${id}/sessions${params}`);
  if (!res.ok) throw new Error("Failed to fetch hunt sessions");
  return res.json();
};

const fetchPartyDrops = async (
  id: string,
  period?: string,
): Promise<PartyDrop[]> => {
  const params = period ? `?period=${period}` : "";
  const res = await fetch(`/api/party-manager/${id}/drops${params}`);
  if (!res.ok) throw new Error("Failed to fetch drops");
  return res.json();
};

const fetchPartyBalance = async (
  id: string,
  period?: string,
): Promise<PartyBalance> => {
  const params = period ? `?period=${period}` : "";
  const res = await fetch(`/api/party-manager/${id}/balance${params}`);
  if (!res.ok) throw new Error("Failed to fetch balance");
  return res.json();
};

export interface TibiaItem {
  name: string;
  [key: string]: unknown;
}

const searchItems = async (query: string): Promise<TibiaItem[]> => {
  if (!query || query.length < 2) return [];
  const res = await fetch(`/api/items?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search items");
  return res.json();
};

const searchHuntingPlaces = async (query: string): Promise<TibiaItem[]> => {
  if (!query || query.length < 2) return [];
  const res = await fetch(`/api/hunting-places?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search hunting places");
  return res.json();
};

// ─── Hooks ──────────────────────────────────────────────────────────────────

export const useUserParties = () => {
  return useQuery<Party[]>({
    queryKey: ["userParties"],
    queryFn: fetchUserParties,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

export const usePartyDetails = (id: string) => {
  return useQuery<Party>({
    queryKey: ["partyDetails", id],
    queryFn: () => fetchPartyDetails(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

export const usePartyHuntSessions = (id: string, period?: string) => {
  return useQuery<HuntSession[]>({
    queryKey: ["partyHuntSessions", id, period],
    queryFn: () => fetchPartyHuntSessions(id, period),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

export const usePartyDrops = (id: string, period?: string) => {
  return useQuery<PartyDrop[]>({
    queryKey: ["partyDrops", id, period],
    queryFn: () => fetchPartyDrops(id, period),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

export const usePartyBalance = (id: string, period?: string) => {
  return useQuery<PartyBalance>({
    queryKey: ["partyBalance", id, period],
    queryFn: () => fetchPartyBalance(id, period),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

export const useSearchItems = (query: string) => {
  return useQuery<TibiaItem[]>({
    queryKey: ["searchItems", query],
    queryFn: () => searchItems(query),
    enabled: query.length >= 2,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchHuntingPlaces = (query: string) => {
  return useQuery<TibiaItem[]>({
    queryKey: ["searchHuntingPlaces", query],
    queryFn: () => searchHuntingPlaces(query),
    enabled: query.length >= 2,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// ─── Mutations (for API-based operations that don't use server actions) ─────

export const useInvalidatePartyData = () => {
  const queryClient = useQueryClient();

  return {
    invalidateParties: () =>
      queryClient.invalidateQueries({ queryKey: ["userParties"] }),
    invalidatePartyDetails: (id: string) =>
      queryClient.invalidateQueries({ queryKey: ["partyDetails", id] }),
    invalidateHuntSessions: (id: string) =>
      queryClient.invalidateQueries({ queryKey: ["partyHuntSessions", id] }),
    invalidateDrops: (id: string) =>
      queryClient.invalidateQueries({ queryKey: ["partyDrops", id] }),
    invalidateBalance: (id: string) =>
      queryClient.invalidateQueries({ queryKey: ["partyBalance", id] }),
    invalidateAll: (id: string) => {
      queryClient.invalidateQueries({ queryKey: ["userParties"] });
      queryClient.invalidateQueries({ queryKey: ["partyDetails", id] });
      queryClient.invalidateQueries({ queryKey: ["partyHuntSessions", id] });
      queryClient.invalidateQueries({ queryKey: ["partyDrops", id] });
      queryClient.invalidateQueries({ queryKey: ["partyBalance", id] });
    },
  };
};
