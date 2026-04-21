// ── useExpenses.js ───────────────────────────────────────────────────
// Custom hook: manages expenses for a specific group with real-time sync.
// Hooks: useState, useEffect, useCallback

import { useState, useEffect, useCallback } from "react";
import {
  subscribeToExpenses,
  addExpenseToDb,
  deleteExpenseFromDb,
  subscribeToSettlements,
} from "../services/firebase";

export function useExpenses(groupId) {
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect: real-time Firestore listener for expenses
  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    const unsubExpenses = subscribeToExpenses(groupId, (fetched) => {
      setExpenses(fetched);
      setLoading(false);
    });
    const unsubSettlements = subscribeToSettlements(groupId, (fetched) => {
      setSettlements(fetched);
    });
    return () => {
      unsubExpenses();
      unsubSettlements();
    };
  }, [groupId]);

  // useCallback: memoizes addExpense to preserve referential equality
  const addExpense = useCallback(
    async (expenseData) => {
      await addExpenseToDb(groupId, expenseData);
    },
    [groupId]
  );

  const deleteExpense = useCallback(
    async (expenseId) => {
      await deleteExpenseFromDb(groupId, expenseId);
    },
    [groupId]
  );

  return { expenses, settlements, loading, addExpense, deleteExpense };
}
