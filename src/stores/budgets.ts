import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Budget } from "@/types";
import { useTransactionsStore } from "./transactions";

export const useBudgetsStore = defineStore("budgets", () => {
  const budgets = ref<Budget[]>([]);

  
  const loadFromStorage = () => {
    const stored = localStorage.getItem("budgets");
    if (stored) {
      budgets.value = JSON.parse(stored);
    }
  };

  
  const saveToStorage = () => {
    localStorage.setItem("budgets", JSON.stringify(budgets.value));
  };

  
  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    budgets.value.push(newBudget);
    saveToStorage();
  };

  
  const deleteBudget = (id: string) => {
    budgets.value = budgets.value.filter((b) => b.id !== id);
    saveToStorage();
  };

  
  const updateBudget = (id: string, updates: Partial<Budget>) => {
    const index = budgets.value.findIndex((b) => b.id === id);
    if (index !== -1) {
      budgets.value[index] = { ...budgets.value[index], ...updates };
      saveToStorage();
    }
  };

  
  const calculateSpent = (category: string) => {
    const transactionsStore = useTransactionsStore();
    return transactionsStore.expensesByCategory[category] || 0;
  };

  
  const updateAllSpent = () => {
    budgets.value.forEach((budget) => {
      budget.spent = calculateSpent(budget.category);
    });
    saveToStorage();
  };

  
  const budgetsWithProgress = computed(() => {
    return budgets.value.map((budget) => ({
      ...budget,
      spent: calculateSpent(budget.category),
      percentage:
        budget.limit > 0
          ? (calculateSpent(budget.category) / budget.limit) * 100
          : 0,
      isOverBudget: calculateSpent(budget.category) > budget.limit,
    }));
  });

  
  loadFromStorage();

  return {
    budgets,
    addBudget,
    deleteBudget,
    updateBudget,
    updateAllSpent,
    budgetsWithProgress,
  };
});
