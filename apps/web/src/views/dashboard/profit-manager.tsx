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
            <AddProfitEntry
              character={String(selectedCharacter)}
              setIsDialogOpen={setIsDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!history || history?.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg bg-secondary/20">
          <p className="text-lg">{t("noProfitEntries")}</p>
        </div>
      ) : (
        <div>
          <ProfitManagerCards />
          <div className="text-xs mt-4 mb-2">
            {t.rich("tibiaTradeNote", {
              tibiaTrade: (chunks) => (
                <Link
                  href="https://tibiatrade.gg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </div>
          <ProfitTable character={String(selectedCharacter)} />
        </div>
      )}
    </div>
  );
};
