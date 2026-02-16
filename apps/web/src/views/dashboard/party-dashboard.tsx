"use client";

import { BalanceTab } from "@/components/party/balance-tab";
import { DropsTab } from "@/components/party/drops-tab";
import { HuntSessionsTab } from "@/components/party/hunt-sessions-tab";
import { InviteDialog } from "@/components/party/invite-dialog";
import { PartyOverviewTab } from "@/components/party/party-overview-tab";
import { PartyVisibilityToggle } from "@/components/party/party-visibility-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { usePartyDetails } from "@/queries/party.queries";
import {
  ChevronLeftIcon,
  ExternalLink,
  GemIcon,
  LayoutDashboardIcon,
  SwordsIcon,
  WalletIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

type Tab = "overview" | "sessions" | "drops" | "balance";

export const PartyDashboardView = () => {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const params = useParams();
  const partyId = params.id as string;
  const session = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [period, setPeriod] = useState<string | undefined>(undefined);

  const { data: party, isLoading } = usePartyDetails(partyId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!party) {
    return (
      <div className="container mx-auto py-12 px-4 min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">{t("partyNotFound")}</h2>
        <Link href="/dashboard/party">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeftIcon size={16} className="mr-2" />
            {t("buttons.backToParties")}
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner =
    party.createdBy === session.data?.user?.id ||
    party.members.some(
      (m) => m.userId === session.data?.user?.id && m.isLeader,
    );

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "overview",
      label: t("tabs.overview"),
      icon: <LayoutDashboardIcon size={16} />,
    },
    {
      key: "sessions",
      label: t("tabs.sessions"),
      icon: <SwordsIcon size={16} />,
    },
    { key: "drops", label: t("tabs.drops"), icon: <GemIcon size={16} /> },
    {
      key: "balance",
      label: t("tabs.balance"),
      icon: <WalletIcon size={16} />,
    },
  ];

  const periodOptions = [
    { key: undefined, label: t("periods.all") },
    { key: "week", label: t("periods.week") },
    { key: "month", label: t("periods.month") },
    { key: "year", label: t("periods.year") },
  ];

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/party"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
        >
          <ChevronLeftIcon
            size={14}
            className="mr-1 transition-transform group-hover:-translate-x-0.5"
          />
          {t("buttons.backToParties")}
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
              {party.name}
            </h2>
            {party.description && (
              <p className="text-muted-foreground mt-1">{party.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {party.slug && (
              <Link href={`/party/${party.slug}`} target="_blank">
                <Button variant="ghost" size="sm" className="rounded-lg">
                  <ExternalLink size={14} className="mr-2" />
                  {t("buttons.viewPublicPage")}
                </Button>
              </Link>
            )}
            {true && (
              <>
                <PartyVisibilityToggle
                  partyId={party.id}
                  isPublic={party.isPublic}
                  slug={party.slug}
                />
                <InviteDialog partyId={party.id} partyName={party.name} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex gap-1 bg-card/40 p-1 rounded-xl border border-border/50 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Period filter (not for overview) */}
        {activeTab !== "overview" && (
          <div className="flex gap-1 bg-card/40 p-1 rounded-xl border border-border/50 backdrop-blur-sm">
            {periodOptions.map((opt) => (
              <button
                key={opt.key || "all"}
                onClick={() => setPeriod(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  period === opt.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "overview" && (
          <PartyOverviewTab party={party} isOwner={isOwner} />
        )}
        {activeTab === "sessions" && (
          <HuntSessionsTab partyId={partyId} period={period} />
        )}
        {activeTab === "drops" && (
          <DropsTab partyId={partyId} period={period} />
        )}
        {activeTab === "balance" && (
          <BalanceTab partyId={partyId} period={period} />
        )}
      </div>
    </div>
  );
};
