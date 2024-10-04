import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Tibia Rise - Compare Characters",
};

const DynamicExperienceSimulatorView = dynamic(
  () => import("../../../views/experience-simulator"),
  { ssr: false }
);

export default function ExperienceSimulator() {
  return <DynamicExperienceSimulatorView />;
}
