<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="dashboard-container">
        <!-- Header -->
        <header class="dashboard-header">
          <div class="header-content">
            <div class="profile-section">
              <div class="profile-avatar">
                <ion-icon :icon="personCircle" class="avatar-icon"></ion-icon>
              </div>
              <h1 class="greeting-text">Hola, {{ profile.name }}</h1>
            </div>
            <button class="notification-btn">
              <ion-icon :icon="notificationsOutline"></ion-icon>
            </button>
          </div>
        </header>

        <main class="main-content">
          <!-- Balance Total Card -->
          <div class="balance-card">
            <p class="balance-label">Saldo Total</p>
            <h1 class="balance-amount">{{ formatCurrency(balance) }}</h1>
            
            <!-- Segmented Control -->
            <div class="segment-control">
              <button class="segment-btn active">Cuentas</button>
              <button class="segment-btn">Ahorros</button>
              <button class="segment-btn">Inversiones</button>
            </div>
          </div>

          <!-- Gastos Chart -->
          <div class="expenses-card">
            <p class="card-title">Gastos de {{ currentMonth }}</p>
            <h2 class="expenses-amount">{{ formatCurrency(totalExpenses) }}</h2>
            <div class="expenses-comparison">
              <p class="comparison-label">vs. el mes pasado</p>
              <p class="comparison-value" :class="expensesTrend >= 0 ? 'negative' : 'positive'">
                {{ expensesTrend >= 0 ? '+' : '' }}{{ expensesTrend.toFixed(1) }}%
              </p>
            </div>
            
            <!-- Chart Bars -->
            <div class="chart-container">
              <div v-for="(item, index) in topExpenseCategories" :key="index" class="chart-bar-wrapper">
                <div class="bar-track" :style="`background-color: ${item.color}20`">
                  <div 
                    class="bar-fill" 
                    :style="`background-color: ${item.color}; width: ${item.percentage}%`"
                  ></div>
                </div>
                <p class="bar-label">{{ item.label }}</p>
              </div>
            </div>
          </div>

          <!-- Progreso de Presupuesto -->
          <div class="budget-section">
            <h2 class="section-title">Tu Progreso del Mes</h2>
            
            <div v-if="budgetsWithProgress.length > 0" class="budget-list">
              <div 
                v-for="budget in budgetsWithProgress.slice(0, 3)" 
                :key="budget.id"
                class="budget-item"
                @click="goToBudgets"
              >
                <div class="budget-icon" :class="getBudgetIconClass(budget)">
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
                      :class="getBudgetProgressClass(budget)"
                      :style="`width: ${Math.min(budget.percentage, 100)}%`"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <ion-icon :icon="pieChartOutline" class="empty-icon"></ion-icon>
              <p class="empty-text">No hay presupuestos configurados</p>
              <ion-button @click="goToBudgets" class="empty-button">
                Crear presupuesto
              </ion-button>
            </div>
          </div>
        </main>

        <!-- Floating Action Button -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="fab-button">
          <ion-fab-button @click="goToTransactions" color="success">
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonFab,
  IonFabButton
} from '@ionic/vue';
import { 
  personCircle, 
  notificationsOutline, 
  add,
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
import { useTransactionsStore } from '@/stores/transactions';
import { useBudgetsStore } from '@/stores/budgets';
import { useProfileStore } from '@/stores/profile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const transactionsStore = useTransactionsStore();
const budgetsStore = useBudgetsStore();
const profileStore = useProfileStore();
const router = useRouter();

const { totalIncome, totalExpenses, balance, expensesByCategory } = storeToRefs(transactionsStore);
const { budgetsWithProgress } = storeToRefs(budgetsStore);
const { profile } = storeToRefs(profileStore);

// Mes actual
const currentMonth = computed(() => {
  return new Date().toLocaleDateString('es-ES', { month: 'long' });
});

// Tendencia de gastos (simulado)
const expensesTrend = computed(() => {
  // Por ahora retornamos un valor simulado
  // En producción, compararías con el mes anterior
  return -5.2;
});

// Top categorías de gastos
const topExpenseCategories = computed(() => {
  const categories = Object.entries(expensesByCategory.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  
  const maxAmount = Math.max(...categories.map(c => c[1]), 1);
  
  const colors = ['#20C997', '#FFC107', '#9C27B0', '#FF9800'];
  const labels = [
    'Comida', 'Transp.', 'Servicios', 'Ocio'
  ];
  
  return categories.map((cat, index) => ({
    category: cat[0],
    amount: cat[1],
    percentage: (cat[1] / maxAmount) * 100,
    color: colors[index] || '#20C997',
    label: labels[index] || cat[0].substring(0, 8)
  }));
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: profile.value.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const goToTransactions = () => {
  router.push('/tabs/transactions');
};

const goToBudgets = () => {
  router.push('/tabs/budgets');
};

// Obtener icono según categoría
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

// Clases para el icono del presupuesto
const getBudgetIconClass = (budget: any) => {
  if (budget.isOverBudget) return 'icon-danger';
  if (budget.percentage > 80) return 'icon-warning';
  return 'icon-success';
};

// Clases para la barra de progreso
const getBudgetProgressClass = (budget: any) => {
  if (budget.isOverBudget) return 'progress-danger';
  if (budget.percentage > 80) return 'progress-warning';
  return 'progress-success';
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100%;
  padding-bottom: 100px;
  background: var(--ion-background-color);
}

/* Header */
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--ion-background-color);
  backdrop-filter: blur(10px);
  padding: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #20C997, #17a589);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 48px;
  color: white;
}

.greeting-text {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0;
  color: var(--ion-text-color);
}

.notification-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: var(--ion-text-color);
}

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
}

/* Balance Card */
.balance-card {
  background: var(--ion-card-background, #fff);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.balance-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0 0 12px 0;
}

.balance-amount {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 0 0 20px 0;
  color: var(--ion-text-color);
}

/* Segmented Control */
.segment-control {
  display: flex;
  gap: 4px;
  background: var(--ion-color-light);
  border-radius: 12px;
  padding: 4px;
}

.segment-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.segment-btn.active {
  background: var(--ion-card-background, #fff);
  color: var(--ion-text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Expenses Card */
.expenses-card {
  background: var(--ion-card-background, #fff);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: var(--ion-text-color);
}

.expenses-amount {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 0 0 8px 0;
  color: var(--ion-text-color);
}

.expenses-comparison {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.comparison-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0;
}

.comparison-value {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}

.comparison-value.positive {
  color: #10B981;
}

.comparison-value.negative {
  color: #EF4444;
}

/* Chart */
.chart-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding-top: 16px;
}

.chart-bar-wrapper {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 8px;
}

.bar-track {
  width: 100%;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.bar-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--ion-color-medium);
  margin: 0;
  text-align: center;
}

/* Budget Section */
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

/* Empty State */
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
  margin: 0 0 20px 0;
}

.empty-button {
  --background: #20C997;
  --border-radius: 12px;
}

/* FAB */
.fab-button {
  margin-bottom: 80px;
}

/* Responsive para desktop */
@media (min-width: 768px) {
  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .main-content {
    padding: 24px 32px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .balance-card {
    grid-column: 1 / -1;
  }

  .budget-section {
    grid-column: 1 / -1;
  }

  .chart-container {
    gap: 24px;
  }

  .balance-amount {
    font-size: 48px;
  }
}

@media (min-width: 1200px) {
  .main-content {
    grid-template-columns: repeat(3, 1fr);
  }

  .balance-card {
    grid-column: 1 / 2;
  }

  .expenses-card {
    grid-column: 2 / 3;
  }

  .budget-section {
    grid-column: 3 / 4;
  }
}
</style>
