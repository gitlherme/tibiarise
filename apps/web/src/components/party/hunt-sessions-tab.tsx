"use client";

import { addHuntSession, deleteHuntSession } from "@/app/actions/party.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useInvalidatePartyData,
  usePartyHuntSessions,
  useSearchHuntingPlaces,
} from "@/queries/party.queries";
import { MapPinIcon, PlusIcon, SwordsIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface HuntSessionsTabProps {
  partyId: string;
  period?: string;
}

function parseSessionAnalyzer(raw: string) {
  const lines = raw.split("\n").map((l) => l.trim());
  let loot = 0;
  let supplies = 0;
  let balance = 0;
  let huntName = "";
  let duration: number | undefined;

  for (const line of lines) {
    const lootMatch = line.match(/Loot:\s*([\d,]+)/i);
    const supplyMatch = line.match(/Supplies:\s*([\d,]+)/i);
    const balanceMatch = line.match(/Balance:\s*(-?[\d,]+)/i);
    const sessionMatch = line.match(/Session data:.*?Hunt Session:\s*(.+)/i);
    const durationMatch = line.match(/Session:\s*(\d+):(\d+)(?::(\d+))?/i);

    if (lootMatch) loot = parseInt(lootMatch[1].replace(/,/g, ""));
    if (supplyMatch) supplies = parseInt(supplyMatch[1].replace(/,/g, ""));
    if (balanceMatch) balance = parseInt(balanceMatch[1].replace(/,/g, ""));
    if (sessionMatch) huntName = sessionMatch[1].trim();
    if (durationMatch) {
      const hours = parseInt(durationMatch[1]);
      const minutes = parseInt(durationMatch[2]);
      duration = hours * 60 + minutes;
    }
  }

  return { loot, supplies, balance, huntName, duration };
}

export function HuntSessionsTab({ partyId, period }: HuntSessionsTabProps) {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const { data: sessions, isLoading } = usePartyHuntSessions(partyId, period);
  const { invalidateAll } = useInvalidatePartyData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rawData, setRawData] = useState("");
  const [huntName, setHuntName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedHunt, setSelectedHunt] = useState(false);

  // Search logic
  const { data: searchResults } = useSearchHuntingPlaces(huntName);

  const handleSelectHunt = (name: string) => {
    setHuntName(name);
    setSelectedHunt(true);
    setShowSuggestions(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      if (rawData) {
        const parsed = parseSessionAnalyzer(rawData);
        data = {
          huntName: huntName || parsed.huntName || "Unknown Hunt",
          loot: parsed.loot,
          supplies: parsed.supplies,
          balance: parsed.balance,
          duration: parsed.duration,
          rawSessionData: rawData,
        };
      } else {
        data = {
          huntName: huntName || "Unknown Hunt",
          loot: 0,
          supplies: 0,
          balance: 0,
        };
      }

      await addHuntSession(partyId, data);
      toast.success(t("sessions.addSuccess"));
      invalidateAll(partyId);
      setDialogOpen(false);
      setRawData("");
      setHuntName("");
    } catch {
      toast.error(t("sessions.addError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      await deleteHuntSession(sessionId);
      toast.success(t("sessions.deleteSuccess"));
      invalidateAll(partyId);
    } catch {
      toast.error(t("sessions.deleteError"));
    }
  };

  const formatGold = (value: string) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl px-6 py-5 shadow-soft-primary hover:glow-primary transition-all duration-300">
              <PlusIcon size={18} className="mr-2" />
              {t("sessions.addButton")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card text-card-foreground p-6 sm:rounded-[2rem] shadow-soft border-border/50 backdrop-blur-xl">
            <DialogHeader className="mb-4 mt-4">
              <DialogTitle className="text-2xl font-heading font-bold">
                {t("sessions.addTitle")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("sessions.addDescription")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2 relative">
                <Label>{t("sessions.huntNameLabel")}</Label>
                <Input
                  value={huntName}
                  onChange={(e) => {
                    setHuntName(e.target.value);
                    setSelectedHunt(false);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  // onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder={t("sessions.huntNamePlaceholder")}
                  className="bg-background/50 border-border/50 rounded-lg"
                />
                {showSuggestions &&
                  searchResults &&
                  searchResults.length > 0 &&
                  !selectedHunt && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {searchResults.map((place) => (
                        <button
                          key={place.name}
                          type="button"
                          onClick={() => handleSelectHunt(place.name)}
                          className="w-full text-left px-3 py-2 hover:bg-accent/50 text-sm transition-colors flex items-center gap-2"
                        >
                          <MapPinIcon
                            size={14}
                            className="text-muted-foreground"
                          />
                          {place.name}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              <div className="space-y-2">
                <Label>{t("sessions.sessionDataLabel")}</Label>
                <textarea
                  value={rawData}
                  onChange={(e) => {
                    setRawData(e.target.value);
                    const parsed = parseSessionAnalyzer(e.target.value);
                    if (parsed.huntName && !huntName) {
                      setHuntName(parsed.huntName);
                      // Trigger search to see if it matches a valid place
                      // We rely on the hook to fetch, and if user sees it they can select it
                      // Or we can just set it as text, which is what we do here.
                    }
                  }}
                  placeholder={t("sessions.sessionDataPlaceholder")}
                  className="w-full h-40 bg-background/50 border border-border/50 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-5 shadow-soft-primary"
              >
                {loading ? t("sessions.adding") : t("sessions.addButton")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/50 rounded-[2rem] bg-card/30 backdrop-blur-sm">
          <SwordsIcon className="h-10 w-10 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">{t("sessions.noSessions")}</p>
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    {t("sessions.table.name")}
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    {t("sessions.table.date")}
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    {t("sessions.table.loot")}
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    {t("sessions.table.supplies")}
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    {t("sessions.table.balance")}
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    {t("sessions.table.duration")}
                  </th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border/30 hover:bg-accent/30 transition-colors"
                  >
                    <td className="p-4 font-medium">{s.huntName}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(s.huntDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right text-success">
                      {formatGold(s.loot)}
                    </td>
                    <td className="p-4 text-right text-destructive">
                      {formatGold(s.supplies)}
                    </td>
                    <td
                      className={`p-4 text-right font-medium ${parseInt(s.balance) >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {formatGold(s.balance)}
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      {s.duration
                        ? `${Math.floor(s.duration / 60)}h ${s.duration % 60}m`
                        : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(s.id)}
                        className="h-8 w-8 hover:text-destructive"
                      >
                        <Trash2Icon size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
