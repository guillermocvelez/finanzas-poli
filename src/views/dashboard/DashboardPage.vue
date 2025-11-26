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
              <h1 class="greeting-text">Hola, {{ displayName }}</h1>
            </div>
            <button class="notification-btn">
              <ion-icon :icon="notificationsOutline"></ion-icon>
            </button>
          </div>
        </header>

        <main class="main-content">
          <!-- Balance Card Component -->
          <BalanceCard
            :selected-category="selectedCategory"
            :current-balance="currentBalance"
            :currency="profile.currency"
            @select-category="selectCategory"
          />

          <!-- Expenses Chart Component -->
          <ExpensesChart
            :current-month="currentMonth"
            :total-expenses="totalExpenses"
            :trend="expensesTrend"
            :chart-data="topExpenseCategories"
            :currency="profile.currency"
          />

          <!-- Budget Progress Component -->
          <BudgetProgress
            :budgets="budgetsWithProgress.slice(0, 3)"
            :currency="profile.currency"
            @budget-click="goToBudgets"
          />
        </main>
      </div>

      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="goToTransactions" color="success">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton
} from '@ionic/vue';
import { 
  personCircle, 
  notificationsOutline, 
  add
} from 'ionicons/icons';
import { useTransactionsStore } from '@/stores/transactions';
import { useBudgetsStore } from '@/stores/budgets';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { BalanceCard, ExpensesChart, BudgetProgress } from '@/components/dashboard';

const transactionsStore = useTransactionsStore();
const budgetsStore = useBudgetsStore();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const router = useRouter();

const { totalExpenses, expensesByCategory } = storeToRefs(transactionsStore);
const { budgetsWithProgress } = storeToRefs(budgetsStore);
const { profile } = storeToRefs(profileStore);
const { user } = storeToRefs(authStore);

// Usar el nombre del usuario autenticado si existe, sino usar el del perfil
const displayName = computed(() => user.value?.name || profile.value.name);

// Estado para la categoría seleccionada
const selectedCategory = ref('cuentas');

// Saldos por categoría (datos simulados - en producción vendrían del store)
const categoryBalances = ref({
  cuentas: 2450000,
  ahorros: 8750000,
  inversiones: 15200000
});

// Saldo actual basado en la categoría seleccionada
const currentBalance = computed(() => {
  return categoryBalances.value[selectedCategory.value as keyof typeof categoryBalances.value];
});

// Función para cambiar categoría
const selectCategory = (category: string) => {
  selectedCategory.value = category;
};

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

const goToTransactions = () => {
  router.push('/tabs/transactions');
};

const goToBudgets = () => {
  router.push('/tabs/budgets');
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

  .main-content > :first-child {
    grid-column: 1 / -1;
  }

  .main-content > :last-child {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1200px) {
  .main-content {
    grid-template-columns: repeat(3, 1fr);
  }

  .main-content > :first-child {
    grid-column: 1 / 2;
  }

  .main-content > :nth-child(2) {
    grid-column: 2 / 3;
  }

  .main-content > :last-child {
    grid-column: 3 / 4;
  }
}
</style>
