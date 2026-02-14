import CharmFinderView from "@/views/tools/charm-finder";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ToolsPage" });

  return {
    title: t("charmFinder.title"),
    description: t("charmFinder.description"),
  };
}

export default function CharmFinderPage() {
  return <CharmFinderView />;
}
