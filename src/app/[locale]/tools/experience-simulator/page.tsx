import ExperienceSimulatorView from "@/views/experience-simulator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tibia Rise - Compare Characters",
};

export default function ExperienceSimulator() {
  return <ExperienceSimulatorView />;
}
