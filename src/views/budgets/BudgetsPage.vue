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
          <!-- Summary Card Component -->
          <BudgetSummaryCard
            :total-spent="totalSpent"
            :total-budget="totalBudget"
            :overall-percentage="overallPercentage"
            :currency="profile.currency"
          />

          <!-- Budget List Component -->
          <BudgetList
            :budgets="budgetsWithProgress"
            :currency="profile.currency"
            @budget-click="openEditModal"
            @add-budget="openAddModal"
          />
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
  IonFab,
  IonFabButton,
  alertController
} from '@ionic/vue';
import { 
  add, 
  arrowBackOutline,
  ellipsisVerticalOutline
} from 'ionicons/icons';
import { ref, computed } from 'vue';
import { useBudgetsStore } from '@/stores/budgets';
import { useProfileStore } from '@/stores/profile';
import { storeToRefs } from 'pinia';
import { type Budget } from '@/types';
import { useRouter } from 'vue-router';
import { 
  BudgetFormModal, 
  BudgetSummaryCard, 
  BudgetList 
} from '@/components/budgets';

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

const handleSave = (data: Pick<Budget, 'category' | 'limit' | 'period'>) => {
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
}
</style>
