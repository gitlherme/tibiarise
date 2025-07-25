import { useProfitHistory } from "@/queries/profit-manager.queries";
import { ProfitManagerCard } from "./card";
import { DollarSignIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfitManagerCardsParams {
  character: string;
}

export const ProfitManagerCards = ({ character }: ProfitManagerCardsParams) => {
  const t = useTranslations("Dashboard.ProfitManagerPage");
  const { data: history } = useProfitHistory(character || "");
  const totalProfit = history?.reduce(
    (acc, entry) => acc + (Number(entry.netProfit) || 0),
    0
  );

  const totalHunts = history?.length || 0;

  const bestProfit = history?.reduce((max, entry) => {
    const netProfit = Number(entry.netProfit);
    return netProfit > max ? netProfit : max;
  }, 0);

  const bestProfitHunt = history?.find(
    (entry) => Number(entry.netProfit) === bestProfit
  );

  return (
    <div className="mb-4 grid grid-cols-6 gap-2">
      <ProfitManagerCard
        title={t("profitCards.totalProfit.title")}
        icon={<DollarSignIcon />}
        highlight={String(totalProfit) || "0"}
        note={t("profitCards.totalProfit.note", {
          totalHunts: totalHunts,
        })}
      />
      <ProfitManagerCard
        title={t("profitCards.bestProfit.title")}
        icon={<DollarSignIcon />}
        highlight={String(bestProfit) || "0"}
        note={t("profitCards.bestProfit.note", {
          hunt: bestProfitHunt?.huntName,
        })}
      />
    </div>
  );
};
