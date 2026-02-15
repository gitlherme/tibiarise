"use client";

import { Button } from "@/components/ui/button"; // Assuming default import path
import { Label } from "@/components/ui/label"; // Assuming default import path
import React, { useState } from "react";
// Assuming default import path
import { AddProfitEntry } from "@/components/profit-manager/add-profit-entry";
import { ProfitManagerCards } from "@/components/profit-manager/profit-manager-cards";
import { ProfitTable } from "@/components/profit-manager/profit-table/profit-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // New import for Select
import { Link } from "@/i18n/routing";
import { useProfitHistory } from "@/queries/profit-manager.queries";
import { useGetUserCharacters } from "@/queries/user-data.query";
import { Coins } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export const ProfitManagerView: React.FC = () => {
  const session = useSession();
  const t = useTranslations("Dashboard.ProfitManagerPage");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: characters } = useGetUserCharacters(
    session.data?.user?.email || "",
  );
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    characters?.[0]?.id || null,
  );

  const handleCharacterSelect = (value: string) => {
    setSelectedCharacter(value);
  };

  const { data: history } = useProfitHistory(selectedCharacter || "");

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">
            {t("subtitle", {
              defaultMessage: "Track your hunts and analyze your profit",
            })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/40 p-2 pr-4 rounded-[1.5rem] border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 py-2">
            <Label
              htmlFor="characterSelect"
              className="text-sm font-medium text-muted-foreground whitespace-nowrap"
            >
              {t("form.characterSelect.label")}:
            </Label>
            <Select
              onValueChange={handleCharacterSelect}
              value={selectedCharacter || ""}
              defaultValue={characters?.[0]?.id || ""}
            >
              <SelectTrigger
                id="characterSelect"
                className="w-[180px] h-9 bg-background/50 border-border/50 rounded-lg focus:ring-primary/20"
              >
                <SelectValue
                  placeholder={t("form.characterSelect.placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {characters?.map((char) => (
                  <SelectItem
                    key={char.id}
                    value={char.id}
                    className="cursor-pointer"
                  >
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl px-6 py-5 shadow-soft-primary hover:glow-primary transition-all duration-300">
                {t("buttons.newProfit")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground p-6 sm:rounded-[2rem] shadow-soft border-border/50 backdrop-blur-xl">
              <DialogHeader className="mb-4 mt-4">
                <DialogTitle className="text-2xl font-heading font-bold">
                  {t("form.add.title")}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {t("form.add.description")}
                </DialogDescription>
              </DialogHeader>
              <AddProfitEntry
                character={String(selectedCharacter)}
                setIsDialogOpen={setIsDialogOpen}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!history || history?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 md:p-24 border border-dashed border-border/50 rounded-[2rem] bg-card/30 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <Coins className="h-10 w-10 text-primary/40" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Profit Entries Found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            {t("noProfitEntries")}
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="rounded-xl px-8 py-6 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
          >
            Add Your First Hunt
          </Button>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <ProfitManagerCards />

          <div className="space-y-4">
            <div className="flex justify-end px-2">
              <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                {t.rich("tibiaTradeNote", {
                  tibiaTrade: (chunks) => (
                    <Link
                      href="https://tibiatrade.gg/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium ml-1"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </div>
            </div>
            <ProfitTable character={String(selectedCharacter)} />
          </div>
        </div>
      )}
    </div>
  );
};
