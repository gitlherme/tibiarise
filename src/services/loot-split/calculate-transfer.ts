import { PlayerData } from "./parse-players-data";

export type Transfer = {
  from: string;
  to: string;
  amount: number;
};

export type CalculatorTransfer = {
  transfers: Transfer[];
  profitEach: number;
};

export function calculateTransfers(players: PlayerData[]): CalculatorTransfer {
  const playersToProcess = players.filter((p) => p.enabled);

  const totalProfit = playersToProcess.reduce(
    (sum, player) => sum + player.balance,
    0
  );

  console.log(totalProfit, "TOTAL PROFIT");
  console.log(playersToProcess.length, "PLAYERplayersToProcess LENGTH");

  const profitEach = Math.floor(totalProfit / playersToProcess.length);

  console.log(profitEach, "PROFIT EACH");

  const creditors: { name: string; amount: number }[] = [];
  const debtors: { name: string; amount: number }[] = [];

  playersToProcess.forEach((player) => {
    const diff = player.balance - profitEach;
    if (diff > 0) {
      creditors.push({ name: player.name, amount: diff });
    } else if (diff < 0) {
      debtors.push({ name: player.name, amount: -diff });
    }
  });

  const transfers: Transfer[] = [];

  while (creditors.length && debtors.length) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    const transferAmount = Math.min(creditor.amount, debtor.amount);
    transfers.push({
      from: creditor.name,
      to: debtor.name,
      amount: transferAmount,
    });

    creditor.amount -= transferAmount;
    debtor.amount -= transferAmount;

    if (creditor.amount === 0) creditors.shift();
    if (debtor.amount === 0) debtors.shift();
  }

  return { transfers, profitEach };
}
