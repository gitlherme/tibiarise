"use client";

import { usePartyBalance } from "@/queries/party.queries";
import {
  GemIcon,
  PackageIcon,
  SwordsIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface BalanceTabProps {
  partyId: string;
  period?: string;
}

export function BalanceTab({ partyId, period }: BalanceTabProps) {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const { data: balance, isLoading } = usePartyBalance(partyId, period);

  const formatGold = (value: string | undefined) => {
    if (!value) return "0";
    const num = parseInt(value);
    if (isNaN(num)) return "0";
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/50 rounded-[2rem] bg-card/30 backdrop-blur-sm">
        <WalletIcon className="h-10 w-10 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">{t("balance.noData")}</p>
      </div>
    );
  }

  const netBalance = parseInt(balance.netBalance || "0");

  const cards = [
    {
      icon: <TrendingUpIcon size={20} className="text-success" />,
      label: t("balance.totalLoot"),
      value: formatGold(balance.totalLoot),
      color: "text-success",
    },
    {
      icon: <TrendingDownIcon size={20} className="text-destructive" />,
      label: t("balance.totalSupplies"),
      value: formatGold(balance.totalSupplies),
      color: "text-destructive",
    },
    {
      icon: <WalletIcon size={20} className="text-primary" />,
      label: t("balance.netBalance"),
      value: formatGold(balance.netBalance),
      color: netBalance >= 0 ? "text-success" : "text-destructive",
    },
    {
      icon: <GemIcon size={20} className="text-primary" />,
      label: t("balance.dropsValue"),
      value: formatGold(balance.totalDropsValue),
      color: "text-success",
    },
    {
      icon: <SwordsIcon size={20} className="text-primary" />,
      label: t("balance.totalSessions"),
      value: String(balance.sessionCount),
      color: "text-foreground",
    },
    {
      icon: <PackageIcon size={20} className="text-primary" />,
      label: t("balance.totalDrops"),
      value: String(balance.dropCount),
      color: "text-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm p-6 space-y-3 transition-all duration-300 hover:border-primary/30"
          >
            <div className="flex items-center gap-2">
              {card.icon}
              <span className="text-sm text-muted-foreground font-medium">
                {card.label}
              </span>
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
