import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Budget } from "@/types";
import { useTransactionsStore } from "./transactions";

export const useBudgetsStore = defineStore("budgets", () => {
  const budgets = ref<Budget[]>([]);

  // Cargar datos desde localStorage
  const loadFromStorage = () => {
    const stored = localStorage.getItem("budgets");
    if (stored) {
      budgets.value = JSON.parse(stored);
    }
  };

  // Guardar en localStorage
  const saveToStorage = () => {
    localStorage.setItem("budgets", JSON.stringify(budgets.value));
  };

  // Agregar presupuesto
  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    budgets.value.push(newBudget);
    saveToStorage();
  };

  // Eliminar presupuesto
  const deleteBudget = (id: string) => {
    budgets.value = budgets.value.filter((b) => b.id !== id);
    saveToStorage();
  };

  // Editar presupuesto
  const updateBudget = (id: string, updates: Partial<Budget>) => {
    const index = budgets.value.findIndex((b) => b.id === id);
    if (index !== -1) {
      budgets.value[index] = { ...budgets.value[index], ...updates };
      saveToStorage();
    }
  };

  // Calcular gasto actual basado en transacciones
  const calculateSpent = (category: string) => {
    const transactionsStore = useTransactionsStore();
    return transactionsStore.expensesByCategory[category] || 0;
  };

  // Actualizar gastos de todos los presupuestos
  const updateAllSpent = () => {
    budgets.value.forEach((budget) => {
      budget.spent = calculateSpent(budget.category);
    });
    saveToStorage();
  };

  // Computed: presupuestos con porcentaje de uso
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

  // Inicializar
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
