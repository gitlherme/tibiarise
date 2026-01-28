import { getUserSettings, toggleShowProfitOnHome } from "@/app/actions/user";
import { SettingsView } from "@/views/dashboard/settings";

export default async function SettingsPage() {
  const user = await getUserSettings();

  if (!user) {
    // Should be handled by redirect if not auth, but just in case
    return null;
  }

  return (
    <SettingsView
      initialShowProfitOnHome={user.showProfitOnHome}
      onToggle={toggleShowProfitOnHome}
    />
  );
}
