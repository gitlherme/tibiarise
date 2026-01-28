import { getHomeStats } from "@/app/actions/home";
import { BentoGrid } from "@/components/home/bento-grid";
import { FeaturesSection } from "@/components/home/features-section";
import { HomeSearch } from "@/components/home/home-search";
import { ProfitTicker } from "@/components/home/profit-ticker";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { searchBarSchema } from "../../schemas/search-bar";

const formSchema = searchBarSchema;

export default async function Home() {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value || "en";
  const t = await getTranslations("Homepage");
  const stats = await getHomeStats();

  // Client-side form logic is extracted to a separate component or kept if we make this a client  component?
  // Since 'page.tsx' must be server for getHomeStats, we need to extract the interactive form part or pass it.

  // Wait, the current page uses useForm and router... it is 'use client'.
  // We cannot make 'use client' page async.
  // We need to keep 'page.tsx' as server component and move the client logic (form) to a component.
  // Actually, the previous implementation was 'use client'.

  // REFACTOR STRATEGY:
  // 1. Keep 'page.tsx' as SERVER component to fetch data.
  // 2. Extract the search form to 'HomeSearch.tsx' (client).
  // 3. Pass stats to BentoGrid (client).

  return (
    <main className="w-full min-h-[80vh] flex flex-col justify-center py-12 gap-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto px-4 lg:px-0">
        {/* Left Column: Hero Text & Search */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-center gap-8 py-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground">
              {t("title") || "Tibia Rise"}
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-md">
              {t("description") ||
                "Discover a new level of immersion in Tibia."}
            </p>
          </div>

          <HomeSearch locale={locale} />
        </div>

        {/* Right Column: Bento Grid */}
        <BentoGrid stats={stats} />
      </div>

      {/* New Profit Ticker Section - Full Width */}
      <section className="w-full">
        <ProfitTicker
          recentHunts={stats.recentHunts}
          totalProfit={stats.totalProfit}
        />
      </section>

      {/* Features Section */}
      <FeaturesSection />
    </main>
  );
}
