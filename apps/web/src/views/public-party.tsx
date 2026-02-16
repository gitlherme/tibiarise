"use client";

import { Button } from "@/components/ui/button";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/routing";
import { useQuery } from "@tanstack/react-query";
import {
  BabyIcon,
  ChevronLeftIcon,
  ClockIcon,
  GemIcon,
  GlobeIcon,
  ShieldIcon,
  SwordIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
        dailyExperience: {
          date: string;
          value: string; // BigInt serialized
          level: number;
        }[];
      } | null;
      user: { id: string; email: string };
    }[];
  };
  recentDrops: {
    id: string;
    itemName: string;
    itemId?: number;
    quantity: number;
    value: number;
    source?: string;
    droppedAt: string;
    currency: "GOLD" | "TIBIA_COIN";
  }[];
  recentSessions: {
    id: string;
    huntName: string;
    huntDate: string;
    duration: number | null;
    loot: string; // BigInt serialized -> string
    supplies: string;
    balance: string;
  }[];
  stats: {
    dropCount: number;
    // other stats kept for references if needed, but not displayed personally
  };
}

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

const vocationIcons: Record<string, React.ReactNode> = {
  "Elite Knight": <ShieldIcon size={14} />,
  Knight: <ShieldIcon size={14} />,
  "Elder Druid": <BabyIcon size={14} />,
  Druid: <BabyIcon size={14} />,
  "Master Sorcerer": <GemIcon size={14} />,
  Sorcerer: <GemIcon size={14} />,
  "Royal Paladin": <SwordIcon size={14} />,
  Paladin: <SwordIcon size={14} />,
};

// ─── Component ──────────────────────────────────────────────────────────────

export const PublicPartyView = () => {
  const t = useTranslations("PublicParty");
  const params = useParams();
  const slug = params.slug as string;

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
        <h2 className="text-2xl font-bold">{t("notFound.title")}</h2>
        <p className="text-muted-foreground text-sm">
          {t("notFound.description")}
        </p>
        <Link href="/">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeftIcon size={16} className="mr-2" />
            {t("notFound.backButton")}
          </Button>
        </Link>
      </div>
    );
  }

  const { party, recentDrops, recentSessions } = data;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 min-h-[80vh] flex flex-col gap-10">
      {/* Header Profile Style */}
      <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="h-32 bg-primary/5 w-full absolute top-0 left-0 z-0"></div>
        <div className="relative z-10 px-6 pt-16 pb-6 flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="w-24 h-24 rounded-2xl bg-card border-4 border-background shadow-xl flex items-center justify-center text-4xl font-bold text-primary">
            {party.name.charAt(0)}
          </div>
          <div className="flex-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-heading font-bold">{party.name}</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                {t("header.publicBadge")}
              </span>
            </div>
            {party.description && (
              <p className="text-muted-foreground">{party.description}</p>
            )}
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1.5">
              <UsersIcon size={16} />
              <span>
                {t("header.members", { count: party.members.length })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <GemIcon size={16} />
              <span>{t("header.drops", { count: recentDrops.length })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Members & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Party Stats */}
          <PartyStats party={party} recentSessions={recentSessions} />

          {/* Members */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <UsersIcon size={20} className="text-primary" />
                {t("members.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {party.members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          {/* Timeline */}
          <TimelineSection
            recentSessions={recentSessions}
            recentDrops={recentDrops}
          />
        </div>

        {/* Right Column: Recent Loot Gallery */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <GemIcon size={20} className="text-primary" />
              {t("drops.title")}
            </h2>
          </div>

          {recentDrops.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {recentDrops.map((drop) => (
                <DropItem key={drop.id} drop={drop} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-border/50 bg-card/20 text-center text-muted-foreground text-sm">
              {t("drops.noDrops")}
            </div>
          )}

          <div className="p-6 rounded-xl border border-border/50 bg-gradient-to-br from-card/40 to-primary/5">
            <h3 className="font-semibold mb-2">{t("drops.aboutTitle")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("drops.aboutDescription")}
            </p>
            <div className="mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground flex justify-between">
              <span>
                {t("header.createdOn", {
                  date: formatDate(party.createdAt),
                })}
              </span>
              <span>{t("header.verified")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function MemberCard({
  member,
}: {
  member: PublicPartyData["party"]["members"][0];
}) {
  const t = useTranslations("PublicParty");
  const char = member.character;

  if (!char) {
    return (
      <div className="group relative p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            ?
          </div>
          <div>
            <p className="font-medium">{member.user.email}</p>
            <span className="text-xs text-muted-foreground">
              {t("members.userNoChar")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Process data for the sparkline
  // Ensure we sort by date ascending for the chart
  const xpData = [...char.dailyExperience]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      ...entry,
      value: Number(entry.value),
    }));

  const chartData = xpData.map((d, i) => {
    return { date: d.date, xp: d.value };
  });

  return (
    <div className="group relative p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* Vocation Icon Badge */}
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              {vocationIcons[char.vocation] || <ShieldIcon size={20} />}
            </div>
          </div>
          <div>
            <Link href={`/character/${char.name}`} target="_blank">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {char.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">{char.vocation}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="flex items-center gap-1">
                <GlobeIcon size={10} />
                {char.world}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {t("members.level")}
          </span>
          <span className="text-xl font-bold font-heading">{char.level}</span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-16 w-full -mx-2 opacity-50 group-hover:opacity-100 transition-opacity">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id={`gradient-${char.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="currentColor"
                    className="text-primary"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="currentColor"
                    className="text-primary"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="xp"
                stroke="currentColor"
                className="text-primary"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${char.id})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground/50">
            {t("members.notEnoughData")}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to format item name for TibiaWiki
function formatWikiName(name: string): string {
  return (
    name
      .toLowerCase()
      .split(" ")
      .map((word) => {
        // Keep small words lowercase unless it's the first word
        if (
          ["of", "the", "and", "in", "on", "at", "to", "for"].includes(word)
        ) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("_")
      // Ensure first letter is always uppercase (e.g. "Sword of Valor")
      .replace(/^./, (str) => str.toUpperCase())
  );
}

function DropItem({ drop }: { drop: PublicPartyData["recentDrops"][0] }) {
  // Use TibiaWiki URL pattern or static.tibia.com
  // We need item ID for static.tibia.com or name for tibiawiki

  // Strategy: Try to use TibiaData/Wiki convention if no ID.
  // Note: static.tibia.com uses integer IDs.
  const t = useTranslations("PublicParty");
  const imageUrl = drop.itemId
    ? `https://static.tibia.com/images/charactertrade/objects/${drop.itemId}.gif`
    : `https://tibia.fandom.com/wiki/Special:FilePath/${formatWikiName(drop.itemName)}.gif`;

  return (
    <TooltipProvider>
      <UITooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="group aspect-square rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card hover:border-primary/50 transition-all duration-300 flex items-center justify-center relative overflow-hidden cursor-help">
            {/* Quantity Badge */}
            {drop.quantity > 1 && (
              <div className="absolute top-1 right-1 bg-background/80 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-border">
                {drop.quantity}x
              </div>
            )}

            <div className="relative z-10 p-2">
              <img
                src={imageUrl}
                alt={drop.itemName}
                className="w-8 h-8 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to a secondary source or placeholder
                  const target = e.currentTarget;
                  if (target.src.includes("tibia.fandom.com")) {
                    // Try tibiawiki.com.br as second attempt
                    // Note: TibiaWiki.com.br might use different naming, but usually similar
                    target.src = `https://www.tibiawiki.com.br/wiki/Special:FilePath/${formatWikiName(drop.itemName)}.gif`;
                  } else {
                    target.src =
                      "https://static.tibia.com/images/charactertrade/objects/0.gif";
                    target.style.opacity = "0.5";
                  }
                }}
              />
            </div>

            {/* Currency Badge for Value context (Subtle) */}
            <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {drop.currency === "TIBIA_COIN" ? (
                <div className="bg-blue-500/10 text-blue-500 text-[10px] px-1 rounded">
                  TC
                </div>
              ) : (
                <div className="bg-yellow-500/10 text-yellow-500 text-[10px] px-1 rounded">
                  G
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs p-3 max-w-[200px]">
          <p className="font-bold mb-1">{drop.itemName}</p>
          <div className="space-y-1 text-muted-foreground">
            <div className="flex items-center justify-between gap-4">
              <span>{t("drops.tooltip.date")}</span>
              <span className="text-foreground">
                {formatDate(drop.droppedAt)}
              </span>
            </div>
            {drop.source && (
              <div className="flex items-center justify-between gap-4">
                <span>{t("drops.tooltip.lootedFrom")}</span>
                <span className="text-foreground font-medium text-primary">
                  {drop.source}
                </span>
              </div>
            )}
          </div>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );
}

function TimelineSection({
  recentSessions,
  recentDrops,
}: {
  recentSessions: PublicPartyData["recentSessions"];
  recentDrops: PublicPartyData["recentDrops"];
}) {
  const t = useTranslations("PublicParty");
  // Combine and sort events
  const events = [
    ...recentSessions.map((s) => ({
      type: "session" as const,
      date: new Date(s.huntDate),
      data: s,
    })),
    ...recentDrops.map((d) => ({
      type: "drop" as const,
      date: new Date(d.droppedAt),
      data: d,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10); // Show last 10 activities

  if (events.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <GlobeIcon size={20} className="text-primary" />
          {t("timeline.title")}
        </h2>
      </div>

      <div className="relative border-l-2 border-border/50 ml-3 space-y-8 pl-8 py-2">
        {events.map((event, index) => (
          <div key={index} className="relative">
            <div
              className={`absolute -left-[39px] w-5 h-5 rounded-full border-2 ${event.type === "session" ? "border-primary bg-background" : "border-yellow-500 bg-background"} flex items-center justify-center`}
            >
              <div
                className={`w-2 h-2 rounded-full ${event.type === "session" ? "bg-primary" : "bg-yellow-500"}`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-xs text-muted-foreground font-medium">
                {event.date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                •{" "}
                {event.date.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {event.type === "session" ? (
                <div className="p-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-foreground">
                      {t("timeline.hunt", {
                        name: (event.data as any).huntName,
                      })}
                    </h4>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>
                      {t("timeline.duration", {
                        duration: (event.data as any).duration
                          ? `${Math.floor((event.data as any).duration / 60)}h ${
                              (event.data as any).duration % 60
                            }m`
                          : t("timeline.unknown"),
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm border-l-yellow-500/50 border-l-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <GemIcon size={18} className="text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {t.rich("timeline.looted", {
                          amount: (event.data as any).quantity,
                          item: (event.data as any).itemName,
                          highlight: (chunks) => (
                            <span className="text-yellow-500 font-bold">
                              {chunks}
                            </span>
                          ),
                        })}
                      </div>
                      {(event.data as any).source && (
                        <div className="text-xs text-muted-foreground">
                          {t("timeline.source", {
                            source: (event.data as any).source,
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTibiaNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (
      (num / 1_000_000_000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }) + "kkk"
    );
  }
  if (num >= 1_000_000) {
    return (
      (num / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 }) +
      "kk"
    );
  }
  if (num >= 1_000) {
    return (
      (num / 1_000).toLocaleString("en-US", { maximumFractionDigits: 2 }) + "k"
    );
  }
  return num.toString();
}

function PartyStats({
  party,
  recentSessions,
}: {
  party: PublicPartyData["party"];
  recentSessions: PublicPartyData["recentSessions"];
}) {
  const t = useTranslations("PublicParty.stats");

  // Calculate Total XP (Sum of all members' dailyExperience)
  // Calculate Total XP (Sum of all members' dailyExperience gains)
  const totalXp = party.members.reduce((acc, member) => {
    if (!member.character || member.character.dailyExperience.length < 2)
      return acc;

    const sortedHistory = [...member.character.dailyExperience].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const first = Number(sortedHistory[0].value);
    const last = Number(sortedHistory[sortedHistory.length - 1].value);

    return acc + (last - first);
  }, 0);

  // Calculate Total Time (minutes)
  const totalTime = recentSessions.reduce(
    (acc, session) => acc + (session.duration || 0),
    0,
  );

  // Find Favorite Hunt
  const huntCounts: Record<string, number> = {};
  recentSessions.forEach((s) => {
    huntCounts[s.huntName] = (huntCounts[s.huntName] || 0) + 1;
  });
  const favoriteHunt = Object.entries(huntCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];

  // Prepare Chart Data (Top 5 Contributors)
  const memberContribution = party.members
    .map((m) => {
      if (!m.character || m.character.dailyExperience.length < 2) {
        return {
          name: m.character?.name || m.user.email.split("@")[0],
          value: 0,
        };
      }

      const sortedHistory = [...m.character.dailyExperience].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      const first = Number(sortedHistory[0].value);
      const last = Number(sortedHistory[sortedHistory.length - 1].value);

      return {
        name: m.character.name,
        value: last - first,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ZapIcon size={20} className="text-primary" />
          {t("title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm flex flex-col justify-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
              {t("totalXP")}
            </span>
            <span className="text-2xl font-bold font-heading text-primary">
              {formatTibiaNumber(totalXp)}
            </span>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm flex flex-col justify-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
              {t("totalTime")}
            </span>
            <span className="text-xl font-bold font-heading flex items-center gap-2">
              <ClockIcon size={18} className="text-muted-foreground" />
              {Math.floor(totalTime / 60)}h {totalTime % 60}m
            </span>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm flex flex-col justify-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
              {t("mostHunted")}
            </span>
            <span className="text-lg font-bold font-heading truncate">
              {favoriteHunt || "-"}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="p-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">
            {t("xpBreakdown")}
          </span>
          <div className="flex-1 min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberContribution} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-2 rounded shadow-lg text-xs">
                          <p className="font-bold">{payload[0].payload.name}</p>
                          <p className="text-muted-foreground">
                            {formatTibiaNumber(payload[0].value as number)} XP
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
