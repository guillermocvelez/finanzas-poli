<template>
  <div class="budget-list-container">
    <h2 class="section-title">Presupuestos por Categoría</h2>

    <div v-if="budgets.length > 0" class="budget-list">
      <div 
        v-for="budget in budgets" 
        :key="budget.id"
        class="budget-item"
        @click="$emit('budget-click', budget)"
      >
        <div class="budget-icon-wrapper">
          <ion-icon :icon="getBudgetIcon(budget.category)" class="budget-icon"></ion-icon>
        </div>
        <div class="budget-content">
          <div class="budget-header">
            <p class="budget-name">{{ budget.category }}</p>
            <p class="budget-amounts">
              {{ formatCurrency(budget.spent) }} / {{ formatCurrency(budget.limit) }}
            </p>
          </div>
          <div class="budget-progress-wrapper">
            <div class="progress-bar-track">
              <div 
                class="progress-bar-fill"
                :class="getProgressColor(budget.percentage)"
                :style="`width: ${Math.min(budget.percentage, 100)}%`"
              ></div>
            </div>
            <p class="progress-percentage" :class="getPercentageColor(budget.percentage)">
              {{ Math.round(budget.percentage) }}%
            </p>
          </div>
          <p class="budget-remaining" :class="getRemainingColor(budget)">
            {{ budget.isOverBudget 
              ? `Excedido por ${formatCurrency(budget.spent - budget.limit)}` 
              : `Te quedan ${formatCurrency(budget.limit - budget.spent)}` 
            }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <ion-icon :icon="pieChartOutline" class="empty-icon"></ion-icon>
      <p class="empty-text">{{ emptyMessage }}</p>
      <ion-button @click="$emit('add-budget')" class="empty-button">
        {{ emptyButtonText }}
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';
import {
  pieChartOutline,
  restaurantOutline,
  carOutline,
  homeOutline,
  gameControllerOutline,
  medkitOutline,
  schoolOutline,
  shirtOutline,
  cartOutline
} from 'ionicons/icons';
import type { Budget } from '@/types';

interface BudgetWithProgress extends Budget {
  percentage: number;
  isOverBudget: boolean;
}

interface Props {
  budgets: BudgetWithProgress[];
  currency: string;
  emptyMessage?: string;
  emptyButtonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  emptyMessage: 'No hay presupuestos configurados',
  emptyButtonText: 'Crear primer presupuesto'
});

defineEmits<{
  'budget-click': [budget: BudgetWithProgress]
  'add-budget': []
}>();

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const getBudgetIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    'Alimentación': restaurantOutline,
    'Transporte': carOutline,
    'Vivienda': homeOutline,
    'Entretenimiento': gameControllerOutline,
    'Salud': medkitOutline,
    'Educación': schoolOutline,
    'Ropa': shirtOutline,
    'Servicios': homeOutline,
    'Otros gastos': cartOutline
  };
  return iconMap[category] || cartOutline;
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return 'progress-danger';
  if (percentage >= 80) return 'progress-warning';
  return 'progress-success';
};

const getPercentageColor = (percentage: number) => {
  if (percentage >= 100) return 'text-danger';
  if (percentage >= 80) return 'text-warning';
  return 'text-neutral';
};

const getRemainingColor = (budget: BudgetWithProgress) => {
  if (budget.isOverBudget) return 'text-danger';
  if (budget.percentage >= 80) return 'text-warning';
  return 'text-neutral';
};
</script>

<style scoped>
.budget-list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0;
  letter-spacing: -0.5px;
}

.budget-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.budget-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--ion-card-background, #fff);
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--ion-border-color, #e0e0e0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.budget-item:active {
  transform: scale(0.98);
}

.budget-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(32, 201, 151, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.budget-icon {
  font-size: 24px;
  color: #20C997;
}

.budget-content {
  flex: 1;
  min-width: 0;
}

.budget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.budget-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-text-color);
  margin: 0;
}

.budget-amounts {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-text-color);
  margin: 0;
  white-space: nowrap;
}

.budget-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.progress-bar-track {
  flex: 1;
  height: 6px;
  background: var(--ion-color-light);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-bar-fill.progress-success {
  background: #20C997;
}

.progress-bar-fill.progress-warning {
  background: #FFC107;
}

.progress-bar-fill.progress-danger {
  background: #EF4444;
}

.progress-percentage {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.progress-percentage.text-success {
  color: #20C997;
}

.progress-percentage.text-warning {
  color: #FFC107;
}

.progress-percentage.text-danger {
  color: #EF4444;
}

.progress-percentage.text-neutral {
  color: var(--ion-color-medium);
}

.budget-remaining {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
}

.budget-remaining.text-success {
  color: #20C997;
}

.budget-remaining.text-warning {
  color: #FFC107;
}

.budget-remaining.text-danger {
  color: #EF4444;
}

.budget-remaining.text-neutral {
  color: var(--ion-color-medium);
}

.empty-state {
  text-align: center;
  padding: 64px 16px;
  background: var(--ion-card-background, #fff);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-top: 32px;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: var(--ion-color-medium);
  margin: 0 0 20px 0;
}

.empty-button {
  --background: #20C997;
  --border-radius: 12px;
}

@media (min-width: 768px) {
  .budget-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1200px) {
  .budget-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
