import CharacterProfileView from "@/views/character-profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tibia Rise",
};

export default function CharacterProfile() {
  return <CharacterProfileView />;
}