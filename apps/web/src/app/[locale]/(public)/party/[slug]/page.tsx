import { PublicPartyView } from "@/views/public-party";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Profile | Tibia Rise",
};

export default function PublicPartyPage() {
  return <PublicPartyView />;
}
