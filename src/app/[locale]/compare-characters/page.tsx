import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Tibia Rise - Compare Characters",
};

const DynamicCompareCharactersView = dynamic(
  () => import("../../../views/compare-characters"),
  { ssr: false }
);

export default function CompareCharacters() {
  return <DynamicCompareCharactersView />;
}
