import { create } from "zustand";

type ExperienceTableItem = {
  date: string;
  expChange: string;
  vocationRank: string;
  level: number;
  totalExperience: number;
};

type ExperienceTableStore = {
  data: ExperienceTableItem[];
};

export const useExperienceTable = create<ExperienceTableStore>((set) => ({
  data: [],
  setExperienceTable: (data: ExperienceTableStore) => set({ data: data }),
}));
