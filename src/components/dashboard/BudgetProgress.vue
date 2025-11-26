<template>
  <div class="budget-section">
    <h2 class="section-title">Tu Progreso del Mes</h2>
    
    <div v-if="budgets.length > 0" class="budget-list">
      <div 
        v-for="budget in budgets" 
        :key="budget.id"
        class="budget-item"
        @click="$emit('budget-click')"
      >
        <div class="budget-icon" :class="getIconClass(budget)">
          <ion-icon :icon="getBudgetIcon(budget.category)"></ion-icon>
        </div>
        <div class="budget-content">
          <div class="budget-header">
            <p class="budget-name">{{ budget.category }}</p>
            <p class="budget-amounts" :class="{ 'over-budget': budget.isOverBudget }">
              {{ formatCurrency(budget.spent) }} / {{ formatCurrency(budget.limit) }}
            </p>
          </div>
          <div class="budget-progress-bar">
            <div 
              class="budget-progress-fill" 
              :class="getProgressClass(budget)"
              :style="`width: ${Math.min(budget.percentage, 100)}%`"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <ion-icon :icon="pieChartOutline" class="empty-icon"></ion-icon>
      <p class="empty-text">No hay presupuestos configurados</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import {
  pieChartOutline,
  restaurantOutline,
  busOutline,
  homeOutline,
  cartOutline,
  cardOutline,
  medkitOutline,
  schoolOutline,
  shirtOutline,
  tvOutline
} from 'ionicons/icons';

interface Budget {
  id: string;
  category: string;
  spent: number;
  limit: number;
  percentage: number;
  isOverBudget: boolean;
}

interface Props {
  budgets: Budget[];
  currency: string;
}

const props = defineProps<Props>();

defineEmits<{
  'budget-click': []
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
    'Transporte': busOutline,
    'Vivienda': homeOutline,
    'Compras': cartOutline,
    'Entretenimiento': tvOutline,
    'Salud': medkitOutline,
    'Educación': schoolOutline,
    'Ropa': shirtOutline,
    'Servicios': cardOutline
  };
  return iconMap[category] || cardOutline;
};

const getIconClass = (budget: Budget) => {
  if (budget.isOverBudget) return 'icon-danger';
  if (budget.percentage > 80) return 'icon-warning';
  return 'icon-success';
};

const getProgressClass = (budget: Budget) => {
  if (budget.isOverBudget) return 'progress-danger';
  if (budget.percentage > 80) return 'progress-warning';
  return 'progress-success';
};
</script>

<style scoped>
.budget-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: var(--ion-text-color);
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
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.budget-item:active {
  transform: scale(0.98);
}

.budget-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
}

.budget-icon.icon-success {
  background: rgba(32, 201, 151, 0.1);
  color: #20C997;
}

.budget-icon.icon-warning {
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.budget-icon.icon-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.budget-content {
  flex: 1;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.budget-name {
  font-weight: 700;
  margin: 0;
  color: var(--ion-text-color);
}

.budget-amounts {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0;
}

.budget-amounts.over-budget {
  color: #EF4444;
  font-weight: 700;
}

.budget-progress-bar {
  height: 8px;
  background: var(--ion-color-light);
  border-radius: 4px;
  overflow: hidden;
}

.budget-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.budget-progress-fill.progress-success {
  background: #20C997;
}

.budget-progress-fill.progress-warning {
  background: #FFC107;
}

.budget-progress-fill.progress-danger {
  background: #EF4444;
}

.empty-state {
  text-align: center;
  padding: 48px 16px;
  background: var(--ion-card-background, #fff);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 64px;
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: var(--ion-color-medium);
  margin: 0;
}
</style>
