import { profitHistoryStore } from "@/stores/profit-history.store";
import { useAtomValue } from "jotai";
import { Coins, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProfitManagerCard } from "./card";

export const ProfitManagerCards = () => {
  const t = useTranslations("Dashboard.ProfitManagerPage");
  const { history } = useAtomValue(profitHistoryStore);

  const totalProfit =
    history?.reduce((acc, entry) => acc + (Number(entry.netProfit) || 0), 0) ||
    0;

  const totalHunts = history?.length || 0;

  const bestProfit =
    history?.reduce((max, entry) => {
      const netProfit = Number(entry.netProfit);
      return netProfit > max ? netProfit : max;
    }, 0) || 0;

  const bestProfitHunt = history?.find(
    (entry) => Number(entry.netProfit) === bestProfit,
  );

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProfitManagerCard
        title={t("profitCards.totalProfit.title")}
        icon={<Coins size={18} />}
        highlight={String(totalProfit)}
        note={t("profitCards.totalProfit.note", {
          totalHunts: totalHunts,
        })}
      />
      <ProfitManagerCard
        title={t("profitCards.bestProfit.title")}
        icon={<Trophy size={18} />}
        highlight={String(bestProfit)}
        note={t("profitCards.bestProfit.note", {
          hunt: bestProfitHunt?.huntName || "N/A",
        })}
        variant="profit"
      />
    </div>
  );
};
