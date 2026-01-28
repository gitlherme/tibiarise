import { atom } from "jotai";
import { ProfitEntry } from "@/queries/profit-manager.queries";

export const profitHistoryStore = atom<{
  history: ProfitEntry[];
}>({
  history: [],
});
