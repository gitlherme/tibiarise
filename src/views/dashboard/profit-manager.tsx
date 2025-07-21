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

interface HuntEntry {
  huntName: string;
  huntDate: string;
  grossProfit: number;
  preysCardsUsed: number;
  boostTcsValue: number;
  tibiaCoinValue?: number;
  netProfit: number;
  characterName: string; // Added characterName to the hunt entry
}

interface Character {
  id: string;
  name: string;
}

export const ProfitManagerView: React.FC = () => {
  const [form, setForm] = useState({
    huntName: "",
    huntDate: "",
    grossProfit: "",
    preysCardsUsed: "",
    boostTcsValue: "",
  });

  const [history, setHistory] = useState<HuntEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  ); // State for selected character

  // Mock character data (replace with actual data from user's verified characters)
  const characters: Character[] = [
    { id: "1", name: "Sir Lancelot" },
    { id: "2", name: "Mystic Mage" },
    { id: "3", name: "Healadin" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCharacterSelect = (value: string) => {
    setSelectedCharacter(value);
  };

  const calculateNetProfit = (
    grossProfit: number,
    preysCardsUsed: number,
    boostTcsValue: number
  ) => {
    // Example calculation: net = gross - (preysCardsUsed * boostTcsValue)
    return grossProfit - preysCardsUsed * boostTcsValue;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCharacter) {
      alert("Please select a character."); // Simple validation
      return;
    }

    const grossProfit = Number(form.grossProfit);
    const preysCardsUsed = Number(form.preysCardsUsed);
    const boostTcsValue = Number(form.boostTcsValue);

    const netProfit = calculateNetProfit(
      grossProfit,
      preysCardsUsed,
      boostTcsValue
    );

    setHistory([
      ...history,
      {
        huntName: form.huntName,
        huntDate: form.huntDate,
        grossProfit,
        preysCardsUsed,
        boostTcsValue,
        tibiaCoinValue: boostTcsValue * 10, // Assuming 1 Boost TC = 10 Tibia Coins
        netProfit,
        characterName: selectedCharacter, // Store the selected character name
      },
    ]);

    // Reset form and close dialog
    setForm({
      huntName: "",
      huntDate: "",
      grossProfit: "",
      preysCardsUsed: "",
      boostTcsValue: "",
    });
    setIsDialogOpen(false); // Close the dialog after submission
  };

  return (
    <div className="container mx-auto p-6 bg-background text-foreground">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-primary">
        Hunt Profit Manager 💰
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        {/* Character Selection */}
        <div className="flex items-center gap-2">
          <Label htmlFor="characterSelect" className="text-lg font-semibold">
            Character:
          </Label>
          <Select
            onValueChange={handleCharacterSelect}
            value={selectedCharacter || ""}
          >
            <SelectTrigger id="characterSelect" className="w-[180px]">
              <SelectValue placeholder="Select Character" />
            </SelectTrigger>
            <SelectContent>
              {characters.map((char) => (
                <SelectItem key={char.id} value={char.name}>
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
                  Hunt Date:
                </Label>
                <Input
                  id="huntDate"
                  type="date"
                  name="huntDate"
                  value={form.huntDate}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="grossProfit" className="text-sm font-medium">
                  Gross Profit:
                </Label>
                <Input
                  id="grossProfit"
                  type="number"
                  name="grossProfit"
                  value={form.grossProfit}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="preysCardsUsed" className="text-sm font-medium">
                  Preys Cards Used:
                </Label>
                <Input
                  id="preysCardsUsed"
                  type="number"
                  name="preysCardsUsed"
                  value={form.preysCardsUsed}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="boostTcsValue" className="text-sm font-medium">
                  Value in Boost TCs:
                </Label>
                <Input
                  id="boostTcsValue"
                  type="number"
                  name="boostTcsValue"
                  value={form.boostTcsValue}
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
      {history.length === 0 ? (
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
                  Character
                </TableHead>
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
                  Prey Cards Used
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Boost TCs Value
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tibia Coin Value
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Net Profit
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {history.map((entry, idx) => (
                <TableRow key={idx} className="hover:bg-accent/50">
                  <TableCell className="py-3 px-4 font-medium text-foreground">
                    {entry.characterName}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    {entry.huntName}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    {entry.huntDate}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    {entry.grossProfit}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    {entry.preysCardsUsed}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    {entry.boostTcsValue}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    {entry.tibiaCoinValue}
                  </TableCell>
                  <TableCell className="py-3 px-4 font-bold text-green-600">
                    {entry.netProfit}
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
