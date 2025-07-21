import CompareCharactersView from "@/views/compare-characters";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tibia Rise - Compare Characters",
};

export default function CompareCharacters() {
  return <CompareCharactersView />;
}
