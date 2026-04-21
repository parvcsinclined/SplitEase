// ── useSettlement.js ─────────────────────────────────────────────────
// Custom hook: Greedy Settlement Algorithm with useMemo.
// Minimizes total transactions needed to settle all group debts.

import { useMemo } from "react";

export function useSettlement(expenses = [], settlements = [], members = []) {
  const optimizedDebts = useMemo(() => {
    if (!members.length) return [];

    // Step 1: Calculate net balances
    const balances = {};
    members.forEach((m) => (balances[m] = 0));

    expenses.forEach((exp) => {
      const amount = Number(exp.amount) || 0;
      const splitCount = exp.splitAmong?.length || 1;
      const share = amount / splitCount;
      if (balances[exp.paidBy] !== undefined) balances[exp.paidBy] += amount;
      (exp.splitAmong || []).forEach((uid) => {
        if (balances[uid] !== undefined) balances[uid] -= share;
      });
    });

    // Adjust for recorded settlements
    settlements.forEach((s) => {
      if (balances[s.from] !== undefined) balances[s.from] += Number(s.amount) || 0;
      if (balances[s.to] !== undefined) balances[s.to] -= Number(s.amount) || 0;
    });

    // Step 2: Separate debtors & creditors
    const debtors = [];
    const creditors = [];
    Object.entries(balances).forEach(([uid, bal]) => {
      if (bal < -0.01) debtors.push({ uid, amount: Math.abs(bal) });
      else if (bal > 0.01) creditors.push({ uid, amount: bal });
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    // Step 3: Greedy matching
    const transactions = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const transfer = Math.min(debtors[i].amount, creditors[j].amount);
      transactions.push({
        from: debtors[i].uid,
        to: creditors[j].uid,
        amount: Math.round(transfer * 100) / 100,
      });
      debtors[i].amount -= transfer;
      creditors[j].amount -= transfer;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }
    return transactions;
  }, [expenses, settlements, members]);

  return { optimizedDebts };
}
