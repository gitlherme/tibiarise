import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CharmFinderState {
  selectedCharms: string[];
  toggleCharm: (charmName: string) => void;
  setSelectedCharms: (charms: string[]) => void;
}

export const useCharmFinderStore = create<CharmFinderState>()(
  persist(
    (set) => ({
      selectedCharms: [],
      toggleCharm: (charmName) =>
        set((state) => {
          const exists = state.selectedCharms.includes(charmName);
          return {
            selectedCharms: exists
              ? state.selectedCharms.filter((c) => c !== charmName)
              : [...state.selectedCharms, charmName],
          };
        }),
      setSelectedCharms: (charms) => set({ selectedCharms: charms }),
    }),
    {
      name: "charm-finder-storage",
    }
  )
);
