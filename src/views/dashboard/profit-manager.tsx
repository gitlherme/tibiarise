"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming default import path
import { Input } from "@/components/ui/input"; // Assuming default import path
import { Label } from "@/components/ui/label"; // Assuming default import path
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming default import path
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // New import for Select
import { useGetUserCharacters } from "@/queries/user-data.query";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddProfitEntry,
  useProfitHistory,
} from "@/queries/profit-manager.queries";
import { extractSessionData } from "@/services/hunt-analyser/extract-data";
import { useCookiesNext } from "cookies-next/client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ProfitManagerCard } from "@/components/profit-manager/card";
import { DollarSignIcon } from "lucide-react";

interface HuntEntry {
  huntName: string;
  huntSession: string;
  preyCardsUsed: string;
  boostsValue: string;
}

export const ProfitManagerView: React.FC = () => {
  const session = useSession();
  const t = useTranslations("Dashboard.ProfitManagerPage");
  const locale = useCookiesNext().getCookie("locale") || "en-US"; // Default to 'en-US' if locale is not set
  const [form, setForm] = useState<HuntEntry>({
    huntName: "",
    huntSession: "",
    preyCardsUsed: "",
    boostsValue: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: characters } = useGetUserCharacters(
    session.data?.user?.email || ""
  );
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    characters?.[0]?.id || null
  ); // State for selected character

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCharacterSelect = (value: string) => {
    setSelectedCharacter(value);
  };

  const { data: history, refetch: refetchHistory } = useProfitHistory(
    selectedCharacter || ""
  );

  const totalProfit = history
    ?.reduce((acc, entry) => {
      return acc + (Number(entry.netProfit) || 0);
    }, 0)
    .toLocaleString(locale);

  const addProfitEntryMutation = useAddProfitEntry();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCharacter) {
      alert("Please select a character."); // Simple validation
      return;
    }

    const extractedSessionData = extractSessionData(form.huntSession);

    await addProfitEntryMutation.mutate(
      {
        boostsValue: form.boostsValue,
        huntDate: extractedSessionData?.date.toISOString() || "",
        huntName: form.huntName,
        preyCardsUsed: form.preyCardsUsed,
        profit: extractedSessionData?.grossProfit || "0",
        world:
          characters?.find((char) => char.id === selectedCharacter)?.world ||
          "",
        characterId: selectedCharacter,
      },
      {
        onSuccess: () => {
          refetchHistory();
          setForm({
            huntName: "",
            huntSession: "",
            preyCardsUsed: "",
            boostsValue: "",
          });
          setIsDialogOpen(false);
        },
        onError: (error) => {
          console.error("Error adding profit entry:", error);
          alert("Failed to add profit entry. Please try again.");
        },
      }
    );
  };

  const tProfit = history
    ?.reduce((acc, entry) => acc + (Number(entry.netProfit) || 0), 0)
    .toLocaleString(locale);

  const totalHunts = history?.length || 0;

  const bestProfit = history?.reduce((max, entry) => {
    const netProfit = Number(entry.netProfit);
    return netProfit > max ? netProfit : max;
  }, 0);

  const worstProfit = history?.reduce((min, entry) => {
    const netProfit = Number(entry.netProfit);
    return netProfit < min ? netProfit : min;
  }, 0);

  return (
    <div className="p-6 bg-background text-foreground">
      <h2 className="text-4xl font-bold mb-8">{t("title")}</h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Label htmlFor="characterSelect" className="text-lg font-semibold">
            {t("form.characterSelect.label")}:
          </Label>
          <Select
            onValueChange={handleCharacterSelect}
            value={selectedCharacter || ""}
            defaultValue={characters?.[0]?.id || ""}
          >
            <SelectTrigger id="characterSelect" className="w-[180px]">
              <SelectValue
                placeholder={t("form.characterSelect.placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {characters?.map((char) => (
                <SelectItem key={char.id} value={char.id}>
                  {char.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add New Profit Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-6 py-3">{t("buttons.newProfit")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground p-6 rounded-lg shadow-lg">
            <DialogHeader className="mb-4 mt-4">
              <DialogTitle className="text-2xl font-bold">
                {t("form.add.title")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("form.add.description")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="huntName" className="text-sm font-medium">
                  {t("form.add.huntName")}
                </Label>
                <Input
                  id="huntName"
                  type="text"
                  name="huntName"
                  placeholder={t("form.add.huntNamePlaceholder")}
                  value={form.huntName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="huntSession" className="text-sm font-medium">
                  {t("form.add.huntSession")}
                </Label>
                <Textarea
                  id="huntSession"
                  name="huntSession"
                  placeholder={t("form.add.huntSessionPlaceholder")}
                  value={form.huntSession}
                  onChange={handleChange}
                  required
                  className="mt-1 resize-none max-h-[300px]"
                />
              </div>

              <div>
                <Label htmlFor="preysCardsUsed" className="text-sm font-medium">
                  {t("form.add.preyCards")}
                </Label>
                <Input
                  id="preyCardsUsed"
                  type="number"
                  name="preyCardsUsed"
                  value={form.preyCardsUsed}
                  onChange={handleChange}
                  placeholder={t("form.add.preyCardsPlaceholder")}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="boostsValue" className="text-sm font-medium">
                  {t("form.add.boostValue")}
                </Label>
                <Input
                  id="boostsValue"
                  type="number"
                  name="boostsValue"
                  placeholder={t("form.add.boostValuePlaceholder")}
                  value={form.boostsValue}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full py-2">
                {t("form.add.submit")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!history || history?.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg bg-secondary/20">
          <p className="text-lg">
            No hunt entries yet. Start by selecting a character and adding a new
            profit! ⬆️
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 grid grid-cols-6 gap-2">
            <ProfitManagerCard
              title="Total Profit"
              icon={<DollarSignIcon />}
              highlight={tProfit || "0"}
              note={`in ${totalHunts} hunts`}
            />
            <ProfitManagerCard
              title="Best Profit"
              icon={<DollarSignIcon />}
              highlight={String(bestProfit) || "0"}
              note={`in ${totalHunts} hunts`}
            />
            <ProfitManagerCard
              title="Worst Profit"
              icon={<DollarSignIcon />}
              highlight={String(worstProfit) || "0"}
              note={`in ${totalHunts} hunts`}
            />
          </div>
          <div className="text-xs mt-4 mb-2">
            TC Value provided by:{" "}
            <Link
              href="https://tibiatrade.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Tibia Trade
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-lg border border-border">
            <Table className="min-w-full divide-y divide-border bg-card">
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Hunt Name
                  </TableHead>
                  <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Gross Profit
                  </TableHead>
                  <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tibia Coin Value at Moment
                  </TableHead>
                  <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Value Spent in Prey Card
                  </TableHead>
                  <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Value Spent in Boost
                  </TableHead>
                  <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Net Profit
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {history?.map((entry, idx) => (
                  <TableRow key={idx} className="hover:bg-accent/50">
                    <TableCell className="py-3 px-4 text-foreground">
                      {entry.huntName}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-foreground">
                      {new Date(entry.huntDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-foreground">
                      {Number(entry.profit).toLocaleString(locale)}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-foreground">
                      {Number(entry.tibiaCoinValue).toLocaleString(locale)}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-foreground">
                      {Number(entry.preyCardsUsed).toLocaleString(locale)}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-foreground">
                      {Number(entry.boostsValue).toLocaleString(locale)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "py-3 px-4 font-bold",
                        Number(entry.netProfit) < 0
                          ? "text-red-500"
                          : "text-green-500"
                      )}
                    >
                      {Number(entry.netProfit).toLocaleString(locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
