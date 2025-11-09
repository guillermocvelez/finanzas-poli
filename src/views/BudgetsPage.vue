<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Presupuestos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Presupuestos</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="budgets-container">
        <!-- Botón para agregar presupuesto -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button @click="openAddModal">
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        <!-- Lista de presupuestos -->
        <ion-list v-if="budgetsWithProgress.length > 0">
          <ion-item-sliding v-for="budget in budgetsWithProgress" :key="budget.id">
            <ion-item button @click="openEditModal(budget)">
              <ion-icon 
                :icon="walletOutline"
                :color="budget.isOverBudget ? 'danger' : 'primary'"
                slot="start"
              ></ion-icon>
              <ion-label>
                <h2>{{ budget.category }}</h2>
                <p>{{ budget.period === 'monthly' ? 'Mensual' : budget.period === 'weekly' ? 'Semanal' : 'Anual' }}</p>
                <div class="budget-progress">
                  <ion-progress-bar 
                    :value="budget.percentage / 100"
                    :color="budget.isOverBudget ? 'danger' : budget.percentage > 80 ? 'warning' : 'success'"
                  ></ion-progress-bar>
                  <div class="budget-amounts">
                    <span>{{ formatCurrency(budget.spent) }} gastado</span>
                    <span>de {{ formatCurrency(budget.limit) }}</span>
                  </div>
                </div>
              </ion-label>
              <ion-note 
                slot="end" 
                :color="budget.isOverBudget ? 'danger' : budget.percentage > 80 ? 'warning' : 'success'"
              >
                {{ Math.round(budget.percentage) }}%
              </ion-note>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option color="danger" @click="confirmDelete(budget.id)">
                <ion-icon slot="icon-only" :icon="trash"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>

        <div v-else class="empty-state">
          <ion-icon :icon="pieChartOutline" size="large"></ion-icon>
          <p>No hay presupuestos configurados</p>
          <ion-button @click="openAddModal">Crear primer presupuesto</ion-button>
        </div>
      </div>

      <!-- Modal para agregar/editar presupuesto -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingBudget ? 'Editar' : 'Nuevo' }} Presupuesto</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div class="modal-content">
            <ion-list>
              <ion-item>
                <ion-select 
                  label="Categoría" 
                  v-model="formData.category"
                >
                  <ion-select-option 
                    v-for="cat in EXPENSE_CATEGORIES" 
                    :key="cat"
                    :value="cat"
                  >
                    {{ cat }}
                  </ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-input
                  label="Límite de gasto"
                  v-model="formData.limit"
                  type="number"
                  placeholder="0"
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-select 
                  label="Período" 
                  v-model="formData.period"
                >
                  <ion-select-option value="weekly">Semanal</ion-select-option>
                  <ion-select-option value="monthly">Mensual</ion-select-option>
                  <ion-select-option value="yearly">Anual</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>

            <div class="modal-actions">
              <ion-button expand="block" @click="saveBudget" :disabled="!isFormValid">
                {{ editingBudget ? 'Actualizar' : 'Guardar' }}
              </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonButton,
  IonButtons,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonProgressBar,
  alertController
} from '@ionic/vue';
import { add, walletOutline, trash, pieChartOutline } from 'ionicons/icons';
import { ref, computed } from 'vue';
import { useBudgetsStore } from '@/stores/budgets';
import { useProfileStore } from '@/stores/profile';
import { storeToRefs } from 'pinia';
import { EXPENSE_CATEGORIES, type Budget } from '@/types';

const budgetsStore = useBudgetsStore();
const profileStore = useProfileStore();

const { budgetsWithProgress } = storeToRefs(budgetsStore);
const { profile } = storeToRefs(profileStore);

const isModalOpen = ref(false);
const editingBudget = ref<Budget | null>(null);

const formData = ref({
  category: '',
  limit: 0,
  period: 'monthly' as 'monthly' | 'weekly' | 'yearly'
});

const isFormValid = computed(() => {
  return formData.value.category && 
         formData.value.limit > 0 && 
         formData.value.period;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: profile.value.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const openAddModal = () => {
  editingBudget.value = null;
  formData.value = {
    category: '',
    limit: 0,
    period: 'monthly'
  };
  isModalOpen.value = true;
};

const openEditModal = (budget: Budget) => {
  editingBudget.value = budget;
  formData.value = {
    category: budget.category,
    limit: budget.limit,
    period: budget.period
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingBudget.value = null;
};

const saveBudget = () => {
  if (!isFormValid.value) return;

  if (editingBudget.value) {
    budgetsStore.updateBudget(editingBudget.value.id, {
      category: formData.value.category,
      limit: Number(formData.value.limit),
      period: formData.value.period
    });
  } else {
    budgetsStore.addBudget({
      category: formData.value.category,
      limit: Number(formData.value.limit),
      period: formData.value.period
    });
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
        }
      }
    ]
  });

  await alert.present();
};
</script>

<style scoped>
.budgets-container {
  padding-bottom: 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 64px 16px;
}

.empty-state ion-icon {
  font-size: 80px;
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-state p {
  margin-bottom: 24px;
  opacity: 0.6;
}

.budget-progress {
  margin-top: 8px;
}

.budget-amounts {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-top: 4px;
  opacity: 0.7;
}

.modal-content {
  padding: 16px;
}

.modal-actions {
  padding: 16px 0;
}

/* Responsive para desktop */
@media (min-width: 768px) {
  .budgets-container {
    padding: 24px 32px;
  }

  ion-list {
    border-radius: 8px;
  }
}
</style>
