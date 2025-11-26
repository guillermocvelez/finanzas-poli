<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="transactions-page">
        <!-- Top App Bar -->
        <div class="top-bar">
          <div class="header-row">
            <div class="header-spacer"></div>
            <h1 class="page-title">Transacciones</h1>
            <div class="header-spacer"></div>
          </div>

          <!-- Search Bar Component -->
          <TransactionSearchBar
            v-model="searchQuery"
            placeholder="Buscar por descripción, categoría..."
          />

          <!-- Filters Component -->
          <TransactionFilters
            @toggle-filters="toggleFilters"
            @toggle-sort="toggleSort"
          />
        </div>

        <!-- Transaction List Component -->
        <TransactionList
          :transactions="transactions"
          :currency="profile.currency"
          :search-query="searchQuery"
          @transaction-click="openEditModal"
          @add-transaction="openAddModal"
        />

        <!-- Floating Action Button -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="fab-button">
          <ion-fab-button @click="openAddModal" color="success">
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>

        <!-- Modal para agregar/editar transacción -->
        <TransactionFormModal
          :is-open="isModalOpen"
          :transaction="editingTransaction"
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
import { add } from 'ionicons/icons';
import { ref } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useProfileStore } from '@/stores/profile';
import { storeToRefs } from 'pinia';
import { type Transaction } from '@/types';
import { 
  TransactionFormModal, 
  TransactionSearchBar, 
  TransactionFilters, 
  TransactionList 
} from '@/components/transactions';

const transactionsStore = useTransactionsStore();
const profileStore = useProfileStore();

const { transactions } = storeToRefs(transactionsStore);
const { profile } = storeToRefs(profileStore);

const isModalOpen = ref(false);
const editingTransaction = ref<Transaction | null>(null);
const searchQuery = ref('');

const toggleFilters = () => {
  // Por ahora solo placeholder
  console.log('Filtros');
};

const toggleSort = () => {
  // Por ahora solo placeholder
  console.log('Ordenar');
};

const openAddModal = () => {
  editingTransaction.value = null;
  isModalOpen.value = true;
};

const openEditModal = (transaction: Transaction) => {
  editingTransaction.value = transaction;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingTransaction.value = null;
};

const handleSave = (data: Omit<Transaction, 'id'>) => {
  if (editingTransaction.value) {
    transactionsStore.updateTransaction(editingTransaction.value.id, data);
  } else {
    transactionsStore.addTransaction(data);
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
          closeModal();
        }
      }
    ]
  });

  await alert.present();
};
</script>

<style scoped>
.transactions-page {
  min-height: 100%;
  background: var(--ion-background-color);
}

/* Top Bar */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--ion-background-color);
  backdrop-filter: blur(10px);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  padding-bottom: 8px;
}

.header-spacer {
  width: 48px;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  flex: 1;
  margin: 0;
  color: var(--ion-text-color);
}

/* FAB */
.fab-button {
  margin-bottom: 80px;
}

/* Responsive para desktop */
@media (min-width: 768px) {
  .transactions-page {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
