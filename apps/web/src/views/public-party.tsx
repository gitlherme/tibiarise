"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  GemIcon,
  LayoutDashboardIcon,
  ShieldIcon,
  SwordsIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PublicPartyData {
  party: {
    id: string;
    name: string;
    description: string | null;
    slug: string | null;
    isPublic: boolean;
    createdAt: string;
    members: {
      id: string;
      isLeader: boolean;
      character: {
        id: string;
        name: string;
        world: string;
        level: number;
        vocation: string;
      } | null;
      user: { id: string; email: string };
    }[];
  };
  recentSessions: {
    id: string;
    huntName: string;
    huntDate: string;
    duration: number | null;
    loot: number;
    supplies: number;
    balance: number;
  }[];
  recentDrops: {
    id: string;
    itemName: string;
    quantity: number;
    value: number;
    droppedAt: string;
  }[];
  stats: {
    totalLoot: number;
    totalSupplies: number;
    netBalance: number;
    sessionCount: number;
    dropCount: number;
    dropsValue: number;
  };
}

type Tab = "overview" | "sessions" | "drops" | "balance";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatGold(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}kk`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }
  return value.toLocaleString();
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ──────────────────────────────────────────────────────────────

export const PublicPartyView = () => {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const params = useParams();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { data, isLoading, error } = useQuery<PublicPartyData>({
    queryKey: ["publicParty", slug],
    queryFn: async () => {
      const res = await fetch(`/api/party/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!slug,
    retry: false,
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-12 px-4 min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShieldIcon size={48} className="text-muted-foreground" />
        <h2 className="text-2xl font-bold">{t("partyNotFound")}</h2>
        <p className="text-muted-foreground text-sm">
          This party does not exist or is not public.
        </p>
        <Link href="/">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeftIcon size={16} className="mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const { party, recentSessions, recentDrops, stats } = data;

  return (
    <div className="container mx-auto py-12 px-4 min-h-[60vh]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <ShieldIcon size={12} />
            {t("publicBadge")}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
          {party.name}
        </h1>
        {party.description && (
          <p className="text-muted-foreground mt-1">{party.description}</p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-card/40 p-1 rounded-xl border border-border/50 backdrop-blur-sm mb-8 w-fit">
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

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "overview" && (
          <OverviewSection party={party} stats={stats} t={t} />
        )}
        {activeTab === "sessions" && (
          <SessionsSection sessions={recentSessions} t={t} />
        )}
        {activeTab === "drops" && <DropsSection drops={recentDrops} t={t} />}
        {activeTab === "balance" && <BalanceSection stats={stats} t={t} />}
      </div>
    </div>
  );
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function OverviewSection({
  party,
  stats,
  t,
}: {
  party: PublicPartyData["party"];
  stats: PublicPartyData["stats"];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label={t("overview.members")}
          value={String(party.members.length)}
          icon={<UsersIcon size={18} />}
        />
        <StatCard
          label={t("balance.totalSessions")}
          value={String(stats.sessionCount)}
          icon={<SwordsIcon size={18} />}
        />
        <StatCard
          label={t("balance.totalDrops")}
          value={String(stats.dropCount)}
          icon={<GemIcon size={18} />}
        />
        <StatCard
          label={t("balance.netBalance")}
          value={formatGold(stats.netBalance)}
          icon={<WalletIcon size={18} />}
          valueColor={
            stats.netBalance >= 0 ? "text-success" : "text-destructive"
          }
        />
      </div>

      {/* Members */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t("overview.memberList")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {party.members.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {member.character?.name?.charAt(0) ||
                  member.user?.email?.charAt(0) ||
                  "?"}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {member.character?.name || member.user?.email || "Unknown"}
                </p>
                {member.character && (
                  <p className="text-xs text-muted-foreground truncate">
                    {member.character.vocation} · Lvl {member.character.level} ·{" "}
                    {member.character.world}
                  </p>
                )}
              </div>
              {member.isLeader && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                  Leader
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SessionsSection({
  sessions,
  t,
}: {
  sessions: PublicPartyData["recentSessions"];
  t: ReturnType<typeof useTranslations>;
}) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("sessions.noSessions")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("sessions.table.name")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("sessions.table.date")}
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("sessions.table.loot")}
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("sessions.table.supplies")}
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("sessions.table.balance")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr
              key={s.id}
              className="border-b border-border/30 hover:bg-accent/30 transition-colors"
            >
              <td className="py-3 px-4 text-sm font-medium">{s.huntName}</td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {formatDate(s.huntDate)}
              </td>
              <td className="py-3 px-4 text-sm text-right text-success">
                {formatGold(s.loot)}
              </td>
              <td className="py-3 px-4 text-sm text-right text-destructive">
                {formatGold(s.supplies)}
              </td>
              <td
                className={`py-3 px-4 text-sm text-right font-medium ${s.balance >= 0 ? "text-success" : "text-destructive"}`}
              >
                {formatGold(s.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Showing last 10 sessions
      </p>
    </div>
  );
}

function DropsSection({
  drops,
  t,
}: {
  drops: PublicPartyData["recentDrops"];
  t: ReturnType<typeof useTranslations>;
}) {
  if (drops.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("drops.noDrops")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("drops.table.item")}
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("drops.table.quantity")}
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("drops.table.value")}
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("drops.table.total")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("drops.table.date")}
            </th>
          </tr>
        </thead>
        <tbody>
          {drops.map((d) => (
            <tr
              key={d.id}
              className="border-b border-border/30 hover:bg-accent/30 transition-colors"
            >
              <td className="py-3 px-4 text-sm font-medium">{d.itemName}</td>
              <td className="py-3 px-4 text-sm text-right">{d.quantity}</td>
              <td className="py-3 px-4 text-sm text-right text-muted-foreground">
                {formatGold(d.value)}
              </td>
              <td className="py-3 px-4 text-sm text-right font-medium text-success">
                {formatGold(d.value * d.quantity)}
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {formatDate(d.droppedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Showing last 10 drops
      </p>
    </div>
  );
}

function BalanceSection({
  stats,
  t,
}: {
  stats: PublicPartyData["stats"];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard
        label={t("balance.totalLoot")}
        value={formatGold(stats.totalLoot)}
        valueColor="text-success"
        icon={<SwordsIcon size={18} />}
      />
      <StatCard
        label={t("balance.totalSupplies")}
        value={formatGold(stats.totalSupplies)}
        valueColor="text-destructive"
        icon={<WalletIcon size={18} />}
      />
      <StatCard
        label={t("balance.netBalance")}
        value={formatGold(stats.netBalance)}
        valueColor={stats.netBalance >= 0 ? "text-success" : "text-destructive"}
        icon={<WalletIcon size={18} />}
      />
      <StatCard
        label={t("balance.dropsValue")}
        value={formatGold(stats.dropsValue)}
        valueColor="text-primary"
        icon={<GemIcon size={18} />}
      />
      <StatCard
        label={t("balance.totalSessions")}
        value={String(stats.sessionCount)}
        icon={<SwordsIcon size={18} />}
      />
      <StatCard
        label={t("balance.totalDrops")}
        value={String(stats.dropCount)}
        icon={<GemIcon size={18} />}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  valueColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-2xl font-bold font-heading ${valueColor || ""}`}>
        {value}
      </p>
    </div>
  );
}
