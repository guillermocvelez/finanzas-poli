<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Transacciones</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Transacciones</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="transactions-container">
        <!-- Botón para agregar transacción -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button @click="openAddModal">
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        <!-- Lista de transacciones -->
        <ion-list v-if="transactions.length > 0">
          <ion-item-sliding v-for="transaction in transactions" :key="transaction.id">
            <ion-item button @click="openEditModal(transaction)">
              <ion-icon 
                :icon="transaction.type === 'income' ? arrowUpCircle : arrowDownCircle"
                :color="transaction.type === 'income' ? 'success' : 'danger'"
                slot="start"
              ></ion-icon>
              <ion-label>
                <h2>{{ transaction.description }}</h2>
                <p>{{ transaction.category }}</p>
                <p>{{ formatDate(transaction.date) }}</p>
              </ion-label>
              <ion-note slot="end" :color="transaction.type === 'income' ? 'success' : 'danger'">
                {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
              </ion-note>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option color="danger" @click="confirmDelete(transaction.id)">
                <ion-icon slot="icon-only" :icon="trash"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>

        <div v-else class="empty-state">
          <ion-icon :icon="walletOutline" size="large"></ion-icon>
          <p>No hay transacciones registradas</p>
          <ion-button @click="openAddModal">Agregar primera transacción</ion-button>
        </div>
      </div>

      <!-- Modal para agregar/editar transacción -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingTransaction ? 'Editar' : 'Nueva' }} Transacción</ion-title>
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
                  label="Tipo" 
                  v-model="formData.type"
                  @ionChange="onTypeChange"
                >
                  <ion-select-option value="income">Ingreso</ion-select-option>
                  <ion-select-option value="expense">Gasto</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-input
                  label="Descripción"
                  v-model="formData.description"
                  placeholder="Ej: Compra de supermercado"
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-input
                  label="Monto"
                  v-model="formData.amount"
                  type="number"
                  placeholder="0"
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-select 
                  label="Categoría" 
                  v-model="formData.category"
                >
                  <ion-select-option 
                    v-for="cat in availableCategories" 
                    :key="cat"
                    :value="cat"
                  >
                    {{ cat }}
                  </ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-input
                  label="Fecha"
                  v-model="formData.date"
                  type="date"
                ></ion-input>
              </ion-item>
            </ion-list>

            <div class="modal-actions">
              <ion-button expand="block" @click="saveTransaction" :disabled="!isFormValid">
                {{ editingTransaction ? 'Actualizar' : 'Guardar' }}
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
  alertController
} from '@ionic/vue';
import { add, arrowUpCircle, arrowDownCircle, trash, walletOutline } from 'ionicons/icons';
import { ref, computed } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useProfileStore } from '@/stores/profile';
import { storeToRefs } from 'pinia';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, type Transaction } from '@/types';

const transactionsStore = useTransactionsStore();
const profileStore = useProfileStore();

const { transactions } = storeToRefs(transactionsStore);
const { profile } = storeToRefs(profileStore);

const isModalOpen = ref(false);
const editingTransaction = ref<Transaction | null>(null);

const formData = ref({
  type: 'expense' as 'income' | 'expense',
  description: '',
  amount: 0,
  category: '',
  date: new Date().toISOString().split('T')[0]
});

const availableCategories = computed(() => {
  return formData.value.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
});

const isFormValid = computed(() => {
  return formData.value.description && 
         formData.value.amount > 0 && 
         formData.value.category &&
         formData.value.date;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: profile.value.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const openAddModal = () => {
  editingTransaction.value = null;
  formData.value = {
    type: 'expense',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0]
  };
  isModalOpen.value = true;
};

const openEditModal = (transaction: Transaction) => {
  editingTransaction.value = transaction;
  formData.value = {
    type: transaction.type,
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category,
    date: transaction.date
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingTransaction.value = null;
};

const onTypeChange = () => {
  formData.value.category = '';
};

const saveTransaction = () => {
  if (!isFormValid.value) return;

  if (editingTransaction.value) {
    transactionsStore.updateTransaction(editingTransaction.value.id, {
      ...formData.value,
      amount: Number(formData.value.amount)
    });
  } else {
    transactionsStore.addTransaction({
      ...formData.value,
      amount: Number(formData.value.amount)
    });
  }

  closeModal();
};

const confirmDelete = async (id: string) => {
  const alert = await alertController.create({
    header: 'Confirmar eliminación',
    message: '¿Estás seguro de que quieres eliminar esta transacción?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          transactionsStore.deleteTransaction(id);
        }
      }
    ]
  });

  await alert.present();
};
</script>

<style scoped>
.transactions-container {
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

.modal-content {
  padding: 16px;
}

.modal-actions {
  padding: 16px 0;
}

/* Responsive para desktop */
@media (min-width: 768px) {
  .transactions-container {
    padding: 24px 32px;
  }

  ion-list {
    border-radius: 8px;
  }
}
</style>
