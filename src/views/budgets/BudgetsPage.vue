<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="budgets-page">
        <!-- Top App Bar -->
        <header class="top-bar">
          <div class="header-start">
            <button class="icon-button" @click="goBack">
              <ion-icon :icon="arrowBackOutline"></ion-icon>
            </button>
          </div>
          <h1 class="page-title">Mis Presupuestos</h1>
          <div class="header-end">
            <button class="icon-button">
              <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
            </button>
          </div>
        </header>

        <main class="main-content">
          <!-- Summary Card -->
          <section class="summary-card">
            <div class="summary-header">
              <p class="summary-label">Resumen Mensual</p>
              <p class="summary-period">Este Mes</p>
            </div>
            <div class="summary-amounts">
              <p class="amount-spent">{{ formatCurrency(totalSpent) }}</p>
              <p class="amount-total">/ {{ formatCurrency(totalBudget) }}</p>
            </div>
            <div class="summary-progress">
              <div class="progress-labels">
                <span>Gastado</span>
                <span>Restante: {{ formatCurrency(totalBudget - totalSpent) }}</span>
              </div>
              <div class="progress-track">
                <div 
                  class="progress-fill"
                  :class="getProgressColor(overallPercentage)"
                  :style="`width: ${Math.min(overallPercentage, 100)}%`"
                ></div>
              </div>
            </div>
          </section>

          <!-- Section Header -->
          <h2 class="section-title">Presupuestos por Categoría</h2>

          <!-- Budget List -->
          <div v-if="budgetsWithProgress.length > 0" class="budget-list">
            <div 
              v-for="budget in budgetsWithProgress" 
              :key="budget.id"
              class="budget-item"
              @click="openEditModal(budget)"
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
            <p class="empty-text">No hay presupuestos configurados</p>
            <ion-button @click="openAddModal" class="empty-button">
              Crear primer presupuesto
            </ion-button>
          </div>
        </main>

        <!-- Floating Action Button -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="fab-button">
          <ion-fab-button @click="openAddModal" color="success">
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        <!-- Modal para agregar/editar presupuesto -->
        <BudgetFormModal
          :is-open="isModalOpen"
          :budget="editingBudget"
          @close="closeModal"
          @save="handleSave"
          @delete="confirmDelete"
        />
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
  IonFabButton,
  alertController
} from '@ionic/vue';
import { 
  add, 
  pieChartOutline,
  arrowBackOutline,
  ellipsisVerticalOutline,
  restaurantOutline,
  carOutline,
  homeOutline,
  gameControllerOutline,
  medkitOutline,
  schoolOutline,
  shirtOutline,
  cartOutline
} from 'ionicons/icons';
import { ref, computed } from 'vue';
import { useBudgetsStore } from '@/stores/budgets';
import { useProfileStore } from '@/stores/profile';
import { storeToRefs } from 'pinia';
import { type Budget } from '@/types';
import { useRouter } from 'vue-router';
import { BudgetFormModal } from '@/components/budgets';

const budgetsStore = useBudgetsStore();
const profileStore = useProfileStore();
const router = useRouter();

const { budgetsWithProgress } = storeToRefs(budgetsStore);
const { profile } = storeToRefs(profileStore);

const isModalOpen = ref(false);
const editingBudget = ref<Budget | null>(null);

// Totales
const totalBudget = computed(() => {
  return budgetsWithProgress.value.reduce((sum, b) => sum + b.limit, 0);
});

const totalSpent = computed(() => {
  return budgetsWithProgress.value.reduce((sum, b) => sum + b.spent, 0);
});

const overallPercentage = computed(() => {
  if (totalBudget.value === 0) return 0;
  return (totalSpent.value / totalBudget.value) * 100;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: profile.value.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Obtener icono según categoría
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

// Clases de color para progreso
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

const getRemainingColor = (budget: any) => {
  if (budget.isOverBudget) return 'text-danger';
  if (budget.percentage >= 80) return 'text-warning';
  return 'text-neutral';
};

const goBack = () => {
  router.back();
};

const openAddModal = () => {
  editingBudget.value = null;
  isModalOpen.value = true;
};

const openEditModal = (budget: Budget) => {
  editingBudget.value = budget;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingBudget.value = null;
};

const handleSave = (data: Omit<Budget, 'id'>) => {
  if (editingBudget.value) {
    budgetsStore.updateBudget(editingBudget.value.id, data);
  } else {
    budgetsStore.addBudget(data);
  }
  closeModal();
};

const confirmDelete = async (id: string) => {
  const alert = await alertController.create({
    header: 'Confirmar eliminación',
    message: '¿Estás seguro de que quieres eliminar este presupuesto?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          budgetsStore.deleteBudget(id);
          closeModal();
        }
      }
    ]
  });

  await alert.present();
};
</script>

<style scoped>
.budgets-page {
  min-height: 100%;
  background: var(--ion-background-color);
}

/* Top Bar */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  padding-bottom: 12px;
  background: var(--ion-background-color);
  backdrop-filter: blur(10px);
}

.header-start,
.header-end {
  width: 40px;
  display: flex;
  align-items: center;
}

.header-end {
  justify-content: flex-end;
}

.icon-button {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  color: var(--ion-text-color);
  font-size: 24px;
}

.icon-button:active {
  background: var(--ion-color-light);
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  flex: 1;
  margin: 0;
  color: var(--ion-text-color);
  letter-spacing: -0.5px;
}

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 16px 100px 16px;
}

/* Summary Card */
.summary-card {
  padding: 20px;
  background: var(--ion-card-background, #fff);
  border-radius: 12px;
  border: 1px solid var(--ion-border-color, #e0e0e0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0;
}

.summary-period {
  font-size: 14px;
  font-weight: 700;
  color: #20C997;
  margin: 0;
}

.summary-amounts {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 16px;
}

.amount-spent {
  font-size: 30px;
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0;
}

.amount-total {
  font-size: 16px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0;
}

.summary-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: var(--ion-color-medium);
}

.progress-track {
  width: 100%;
  height: 10px;
  background: var(--ion-color-light);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-fill.progress-success {
  background: #20C997;
}

.progress-fill.progress-warning {
  background: #FFC107;
}

.progress-fill.progress-danger {
  background: #EF4444;
}

/* Section Title */
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

/* Budget List */
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

/* Empty State */
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

/* Modal */
.modal-content {
  padding: 16px;
}

.modal-actions {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* FAB */
.fab-button {
  margin-bottom: 80px;
}

/* Responsive para desktop */
@media (min-width: 768px) {
  .budgets-page {
    max-width: 1200px;
    margin: 0 auto;
  }

  .main-content {
    padding: 0 32px 100px 32px;
  }

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
