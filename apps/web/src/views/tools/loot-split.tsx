"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
import { Label } from "@radix-ui/react-label";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

export default function LootSplitView() {
  const form = useForm();
  const [sessionData, setSessionData] = useState<SessionData>();
  const [originalPlayersData, setOriginalPlayersData] =
    useState<PlayerData[]>();
  const [transfers, setTransfers] = useState<CalculatorTransfer>();
  const t = useTranslations("LootSplitPage");

  const copyTransferMessage = (transfer: Transfer) => {
    navigator.clipboard.writeText(
      `transfer ${transfer.amount} to ${transfer.to}`,
    );

    toast(t("form.result.copied"));
  };

  const copyAllMessages = (transfers: Transfer[]) => {
    const transfersString = transfers
      .map(
        (transfer) =>
          `${transfer.from} needs to pay ${formatNumberToLocaleString(
            transfer.amount,
          )} to ${transfer.to}. (transfer ${transfer.amount} to ${transfer.to})`,
      )
      .join("\n");

    navigator.clipboard.writeText(transfersString);
    toast(t("form.result.copied"));
  };

  const copyAllTransfersMessage = (
    transfers: Transfer[],
    player: PlayerData,
  ) => {
    const transfersString = transfers
      .filter((transfer) => transfer.from === player.name)
      .map((transfer) => `transfer ${transfer.amount} to ${transfer.to}`)
      .join(" / ");

    navigator.clipboard.writeText(transfersString);
    toast(t("form.result.copied"));
  };

  const calculateLootSplit = async (sessionData: SessionData) => {
    const transfers = await calculateTransfers(sessionData.players);
    setSessionData(sessionData);
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
          : p,
      ),
    } as SessionData);
  };

  const handleAddExtraExpense = (player: PlayerData, value: number) => {
    const originalBalance = originalPlayersData?.find(
      (p) => p.name === player.name,
    )?.balance;

    calculateLootSplit({
      ...sessionData,
      players: sessionData?.players?.map((p) =>
        p.name === player.name && p.enabled
          ? {
              ...p,
              balance: isNaN(value)
                ? originalBalance
                : originalBalance! - value,
            }
          : p,
      ),
    } as SessionData);
  };

  const handlePasteSessionData = async (data: string) => {
    const sessionData = await parseSessionData(data);
    if (typeof sessionData === "string") {
      toast(t("form.session.error"));
      return;
    }

    setSessionData(sessionData);
    setOriginalPlayersData(sessionData.players);
    calculateLootSplit(sessionData);
  };

  const enabledPlayers = sessionData?.players.filter((p) => p.enabled);
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold ">{t("title")}</h1>
        <p>{t("description")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
        <div className="col-span-3">
          <div>
            <h2 className="text-xl font-bold">{t("form.session.label")}</h2>
          </div>
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="session"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.session.placeholder")}</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-96"
                        {...field}
                        onPaste={(e) =>
                          handlePasteSessionData(
                            e.clipboardData.getData("text"),
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

        <div className="col-span-5">
          <h2 className="text-xl font-bold">{t("form.result.title")}</h2>
          {!sessionData && <p>{t("form.result.description")}</p>}
          {sessionData && transfers && (
            <div className="flex flex-col">
              <div className="flex gap-2 items-center">
                <div>
                  {t.rich("form.result.totalBalance", {
                    balance: () => (
                      <span
                        className={cn(
                          "font-bold",
                          transfers.profitEach * enabledPlayers!.length > 0
                            ? "text-success"
                            : "text-destructive",
                        )}
                      >
                        {formatNumberToLocaleString(
                          transfers.profitEach * enabledPlayers!.length,
                        )}
                      </span>
                    ),
                  })}
                </div>
                <Image
                  src="/assets/Gold_Coin.gif"
                  alt="Gold Coin"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex gap-2 items-center">
                <div>
                  {t.rich("form.result.profitEach", {
                    profit: () => (
                      <span
                        className={cn(
                          "font-bold",
                          transfers.profitEach > 0
                            ? "text-success"
                            : "text-destructive",
                        )}
                      >
                        {formatNumberToLocaleString(transfers.profitEach)}
                      </span>
                    ),
                  })}
                </div>
                <Image
                  src="/assets/Gold_Coin.gif"
                  alt="Gold Coin"
                  width={32}
                  height={32}
                />
              </div>
              <div className="mt-10">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">
                    {t("form.result.removePlayers")}
                  </h3>
                  <span>🚫</span>
                </div>

                <span className="text-sm text-accent-foreground">
                  {t("form.result.removePlayersDescription")}
                </span>

                <div className="flex gap-4">
                  {sessionData.players.map((player) => (
                    <div
                      key={uuid()}
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
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">
                    {t("form.result.addExtraExpenses")}
                  </h3>
                  <span>💸</span>
                </div>
                <h4 className="mb-2 text-sm text-accent-foreground">
                  {t("form.result.addExtraExpensesDescription")}
                </h4>
                <div className="flex gap-4">
                  {sessionData.players.map((player, index) => (
                    <div
                      key={`${player.name}-${player.damage}-${index}`}
                      className="flex gap-4 items-center mb-10"
                    >
                      <div>
                        <Label className="font-bold text-sm">
                          {player.name}
                        </Label>
                        <Input
                          size={100}
                          onChange={(e) =>
                            handleAddExtraExpense(
                              player,
                              parseInt(e.target.value),
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
                <div className="flex flex-col gap-8">
                  {transfers.transfers.map((transfer) => (
                    <div
                      key={uuid()}
                      className="flex flex-col gap-2 items-center"
                    >
                      <div>
                        {`${
                          transfer.from
                        } needs to pay ${formatNumberToLocaleString(
                          transfer.amount,
                        )} to ${transfer.to}.`}
                      </div>
                      <div className="flex items-center gap-4">
                        <span>
                          transfer {transfer.amount} to {transfer.to}
                        </span>
                        <Button
                          className="cursor-pointer bg-primary h-8 px-2 hover:bg-primary/80"
                          onClick={() => copyTransferMessage(transfer)}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 items-center">
                    <Button
                      onClick={() => copyAllMessages(transfers.transfers)}
                      className="w-fit cursor-pointer bg-primary hover:bg-primary/80"
                    >
                      Copy Full Message
                    </Button>
                    {sessionData.players.map(
                      (player) =>
                        player.enabled &&
                        transfers.transfers.filter(
                          (p) => p.from === player.name,
                        ).length > 0 && (
                          <Button
                            key={uuid()}
                            onClick={() =>
                              copyAllTransfersMessage(
                                transfers.transfers,
                                player,
                              )
                            }
                            className="w-fit cursor-pointer bg-primary hover:bg-primary/80"
                          >
                            Copy {player.name} transfers
                          </Button>
                        ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
