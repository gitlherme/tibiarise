"use client";

import { usePartyBalance, usePartyHuntSessions } from "@/queries/party.queries";
import { calculateTransfers } from "@/services/loot-split/calculate-transfer";
import { parseSessionData } from "@/services/loot-split/parse-players-data";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  CopyIcon,
  GemIcon,
  PackageIcon,
  SwordsIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface BalanceTabProps {
  partyId: string;
  period?: string;
}

export function BalanceTab({ partyId, period }: BalanceTabProps) {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const { data: balance, isLoading: isBalanceLoading } = usePartyBalance(
    partyId,
    period,
  );
  const { data: sessions, isLoading: isSessionsLoading } = usePartyHuntSessions(
    partyId,
    period,
  );

  const isLoading = isBalanceLoading || isSessionsLoading;

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
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/50 rounded-[2rem] bg-card/30 backdrop-blur-sm shadow-inner">
        <WalletIcon className="h-10 w-10 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">{t("balance.noData")}</p>
      </div>
    );
  }

  // Calculate Aggregated Transfers
  const aggregatePlayerData: Record<string, any> = {};

  sessions?.forEach((session) => {
    if (!session.rawSessionData) return;
    const parsed = parseSessionData(session.rawSessionData);
    if (typeof parsed === "string") return;

    parsed.players.forEach((player) => {
      if (!aggregatePlayerData[player.name]) {
        aggregatePlayerData[player.name] = {
          name: player.name,
          balance: 0,
          enabled: true,
        };
      }
      aggregatePlayerData[player.name].balance += player.balance;
    });
  });

  const playersToProcess = Object.values(aggregatePlayerData);
  const transfersData =
    playersToProcess.length > 0 ? calculateTransfers(playersToProcess) : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info(t("balance.copied"));
  };

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
      icon: <GemIcon size={20} className="text-primary" />,
      label: t("balance.dropsValueTc"), // TODO: Add translation key
      value: `${formatGold(balance.totalDropsValueTc)} TC`,
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div
            key={card.label}
            style={{ animationDelay: `${idx * 50}ms` }}
            className="rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm p-6 space-y-3 transition-all duration-300 hover:border-primary/30 hover:bg-card/50 shadow-sm animate-in zoom-in-95"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                {card.icon}
              </div>
              <span className="text-sm text-muted-foreground font-medium truncate">
                {card.label}
              </span>
            </div>
            <p className={`text-2xl font-bold font-heading ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {transfersData && transfersData.transfers.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ChevronRightIcon size={20} className="text-primary" />
              {t("balance.settlementTitle")}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
              <span className="font-medium text-success">
                Profit each: {formatGold(transfersData.profitEach.toString())}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transfersData.transfers.map((transfer, idx) => (
              <div
                key={`${transfer.from}-${transfer.to}-${idx}`}
                className="group relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-4 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:bg-card/60"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t("balance.transferFrom")}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${transfer.from} pays ${formatGold(transfer.amount.toString())} to ${transfer.to}`,
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-primary/10 text-primary"
                    >
                      <CopyIcon size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold truncate">
                        {transfer.from}
                      </p>
                      <p className="text-lg font-black text-primary font-heading">
                        {formatGold(transfer.amount.toString())}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <ArrowRightIcon size={14} />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1 text-right">
                      <p className="text-sm font-bold truncate">
                        {transfer.to}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {t("balance.transferTo")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-125" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
