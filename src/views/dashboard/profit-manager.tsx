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

interface HuntEntry {
  huntName: string;
  huntSession: string;
  preyCardsUsed: string;
  boostsValue: string;
}

export const ProfitManagerView: React.FC = () => {
  const session = useSession();
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

  return (
    <div className="container mx-auto p-6 bg-background text-foreground">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-primary">
        Hunt Profit Manager 💰
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Label htmlFor="characterSelect" className="text-lg font-semibold">
            Character:
          </Label>
          <Select
            onValueChange={handleCharacterSelect}
            value={selectedCharacter || ""}
            defaultValue={characters?.[0]?.id || ""}
          >
            <SelectTrigger id="characterSelect" className="w-[180px]">
              <SelectValue placeholder="Select Character" />
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
            <Button className="px-6 py-3 text-lg">Add New Profit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground p-6 rounded-lg shadow-lg">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold">
                Add New Hunt Profit
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter the details for your latest hunt.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="huntName" className="text-sm font-medium">
                  Hunt Name:
                </Label>
                <Input
                  id="huntName"
                  type="text"
                  name="huntName"
                  value={form.huntName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="huntDate" className="text-sm font-medium">
                  Hunt Analyser or Party Hunt Analyser
                </Label>
                <Textarea
                  id="huntSession"
                  name="huntSession"
                  value={form.huntSession}
                  onChange={handleChange}
                  required
                  className="mt-1 resize-none max-h-[300px]"
                />
              </div>

              <div>
                <Label htmlFor="preysCardsUsed" className="text-sm font-medium">
                  Preys Cards Used: (ex: 2 for 2 Prey Cards)
                </Label>
                <Input
                  id="preyCardsUsed"
                  type="number"
                  name="preyCardsUsed"
                  value={form.preyCardsUsed}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="boostsValue" className="text-sm font-medium">
                  Value Spent in Boost in TCs: (ex: 30 for 30 Tibia Coins)
                </Label>
                <Input
                  id="boostsValue"
                  type="number"
                  name="boostsValue"
                  value={form.boostsValue}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full text-lg py-2">
                Submit Hunt
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <h3 className="text-3xl font-bold mt-12 mb-6 text-center text-secondary-foreground">
        Hunt History 📜
      </h3>
      {!history || history?.length === 0 ? (
        <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg bg-secondary/20">
          <p className="text-lg">
            No hunt entries yet. Start by selecting a character and adding a new
            profit! ⬆️
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
};
