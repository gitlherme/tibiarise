import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CharmFinderState {
  selectedCharms: string[];
  toggleCharm: (charmName: string) => void;
  setSelectedCharms: (charms: string[]) => void;
  characterHealth: number;
  setCharacterHealth: (health: number) => void;
  characterMana: number;
  setCharacterMana: (mana: number) => void;
}

export const useCharmFinderStore = create<CharmFinderState>()(
  persist(
    (set) => ({
      selectedCharms: [],
      characterHealth: 0,
      characterMana: 0,
      setCharacterHealth: (health) => set({ characterHealth: health }),
      setCharacterMana: (mana) => set({ characterMana: mana }),
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
    },
  ),
);
