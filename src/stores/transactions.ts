import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Transaction } from "@/types";

export const useTransactionsStore = defineStore("transactions", () => {
  const transactions = ref<Transaction[]>([]);

  
  const loadFromStorage = () => {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      transactions.value = JSON.parse(stored);
    }
  };

  
  const saveToStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions.value));
  };

  
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    transactions.value.unshift(newTransaction);
    saveToStorage();
  };

  
  const deleteTransaction = (id: string) => {
    transactions.value = transactions.value.filter((t) => t.id !== id);
    saveToStorage();
  };

  
  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const index = transactions.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions.value[index] = { ...transactions.value[index], ...updates };
      saveToStorage();
    }
  };

  
  const totalIncome = computed(() => {
    return transactions.value
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const totalExpenses = computed(() => {
    return transactions.value
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const balance = computed(() => totalIncome.value - totalExpenses.value);

  const recentTransactions = computed(() => {
    return transactions.value.slice(0, 10);
  });

  const expensesByCategory = computed(() => {
    const byCategory: Record<string, number> = {};
    transactions.value
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      });
    return byCategory;
  });

  // Inicializar
  loadFromStorage();

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    totalIncome,
    totalExpenses,
    balance,
    recentTransactions,
    expensesByCategory,
  };
});
