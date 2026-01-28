import { getUserCharacters } from "@/app/actions/dashboard";
import { DashboardView } from "@/views/dashboard/dashboard";

export default async function Page() {
  const characters = await getUserCharacters();

  return <DashboardView characters={characters} />;
}
