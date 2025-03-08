"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateTransfers,
  CalculatorTransfer,
  Transfer,
} from "@/services/loot-split/calculate-transfer";
import {
  parseSessionData,
  PlayerData,
  SessionData,
} from "@/services/loot-split/parse-players-data";
import { formatNumberToLocaleString } from "@/utils/format-number";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LootSplitView() {
  const form = useForm();
  const [sessionData, setSessionData] = useState<SessionData>();
  const [transfers, setTransfers] = useState<CalculatorTransfer>();

  const copyTransferMessage = (transfer: Transfer) => {
    navigator.clipboard.writeText(
      `transfer ${transfer.amount} to ${transfer.to}`
    );

    toast("Copied to clipboard");
  };

  const calculateLootSplit = async (sessionData: SessionData) => {
    setSessionData(sessionData);
    const transfers = await calculateTransfers(sessionData.players);
    setTransfers(transfers);
  };

  const handleTogglePlayer = (player: PlayerData) => {
    calculateLootSplit({
      ...sessionData,
      players: sessionData?.players.map((p) =>
        p.name === player.name
          ? {
              ...p,
              enabled: !p.enabled,
            }
          : p
      ),
    } as SessionData);
  };

  const handleAddExtraExpense = (player: PlayerData, value: number) => {
    calculateLootSplit({
      ...sessionData,
      players: sessionData?.players.map((p) =>
        p.name === player.name
          ? {
              ...p,
              balance: player.balance - value,
            }
          : p
      ),
    } as SessionData);
  };

  const handlePasteSessionData = async (data: string) => {
    const sessionData = await parseSessionData(data);
    if (typeof sessionData === "string") {
      toast(sessionData);
      return;
    }

    setSessionData(sessionData);
    calculateLootSplit(sessionData);
  };

  const enabledPlayers = sessionData?.players.filter((p) => p.enabled);
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">Loot Split</h1>
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-2">
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="session"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paste your session data</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        onPaste={(e) =>
                          handlePasteSessionData(
                            e.clipboardData.getData("text")
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="col-span-2">
          <h2 className="text-2xl font-bold">Loot Analyser</h2>
          {!sessionData && (
            <p>Paste your session data and your analysis will be shown here.</p>
          )}
          {sessionData && transfers && (
            <div className="flex flex-col">
              <div>
                Total balance:{" "}
                {formatNumberToLocaleString(
                  transfers.profitEach * enabledPlayers!.length
                )}{" "}
                gold
              </div>
              <div>
                Total profit for each player:{" "}
                {formatNumberToLocaleString(transfers.profitEach)} gold
              </div>
              <div className="mt-10">
                <h3>Remove Players</h3>

                <div className="flex gap-4">
                  {sessionData.players.map((player) => (
                    <div
                      key={player.name}
                      className="flex gap-4 items-center mb-10 cursor-pointer"
                      onClick={() => handleTogglePlayer(player)}
                    >
                      <Checkbox
                        className="cursor-pointer"
                        checked={!player.enabled}
                      />
                      {player.name}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3>Add extra expenses</h3>
                <h4 className="mb-5">Add number of gold to each player</h4>
                <div className="flex gap-4">
                  {sessionData.players.map((player) => (
                    <div
                      key={player.name}
                      className="flex gap-4 items-center mb-10"
                    >
                      <div>
                        {player.name}
                        <Input
                          onChange={(e) =>
                            handleAddExtraExpense(
                              player,
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="10000000"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <h4 className="mb-5 font-bold">Transfers</h4>
                <div className="flex flex-col gap-4">
                  {transfers.transfers.map((transfer) => (
                    <div
                      key={transfer.amount}
                      className="flex flex-col items-center"
                    >
                      <div>
                        {`${
                          transfer.from
                        } needs to pay ${formatNumberToLocaleString(
                          transfer.amount
                        )} to ${transfer.to}.`}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>
                          transfer {transfer.amount} to {transfer.to}
                        </span>
                        <Button
                          className="cursor-pointer"
                          onClick={() => copyTransferMessage(transfer)}
                          size="sm"
                          variant="outline"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
