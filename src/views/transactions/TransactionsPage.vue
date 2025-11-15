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

          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-bar">
              <ion-icon :icon="searchOutline" class="search-icon"></ion-icon>
              <input 
                type="text" 
                class="search-input" 
                placeholder="Buscar por descripción, categoría..."
                v-model="searchQuery"
              />
            </div>
          </div>

          <!-- Filters and Sort -->
          <div class="filters-row">
            <button class="filter-chip primary" @click="toggleFilters">
              <ion-icon :icon="optionsOutline"></ion-icon>
              <span>Filtros</span>
              <ion-icon :icon="chevronDownOutline"></ion-icon>
            </button>
            <button class="filter-chip" @click="toggleSort">
              <ion-icon :icon="swapVerticalOutline"></ion-icon>
              <span>Ordenar</span>
              <ion-icon :icon="chevronDownOutline"></ion-icon>
            </button>
          </div>
        </div>

        <!-- Transaction List -->
        <div class="transactions-list">
          <div v-if="groupedTransactions.length > 0">
            <div v-for="group in groupedTransactions" :key="group.date" class="transaction-group">
              <h4 class="group-header">{{ group.label }}</h4>
              
              <div class="transaction-items">
                <div 
                  v-for="transaction in group.transactions" 
                  :key="transaction.id"
                  class="transaction-item"
                  @click="openEditModal(transaction)"
                >
                  <div class="transaction-content">
                    <div 
                      class="transaction-icon"
                      :class="transaction.type === 'income' ? 'icon-income' : 'icon-expense'"
                    >
                      <ion-icon :icon="getCategoryIcon(transaction.category, transaction.type)"></ion-icon>
                    </div>
                    <div class="transaction-details">
                      <p class="transaction-title">{{ transaction.description }}</p>
                      <p class="transaction-category">{{ transaction.category }}</p>
                    </div>
                  </div>
                  <div class="transaction-amount">
                    <p 
                      class="amount-text"
                      :class="transaction.type === 'income' ? 'amount-income' : 'amount-expense'"
                    >
                      {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <ion-icon :icon="walletOutline" class="empty-icon"></ion-icon>
            <p class="empty-text">No hay transacciones registradas</p>
            <ion-button @click="openAddModal" class="empty-button">
              Agregar primera transacción
            </ion-button>
          </div>
        </div>

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
  IonButton,
  IonFab,
  IonFabButton,
  alertController
} from '@ionic/vue';
import { 
  add, 
  walletOutline, 
  searchOutline,
  optionsOutline,
  swapVerticalOutline,
  chevronDownOutline,
  restaurantOutline,
  cartOutline,
  cashOutline,
  carOutline,
  homeOutline,
  medkitOutline,
  tvOutline,
  schoolOutline,
  shirtOutline,
  cardOutline
} from 'ionicons/icons';
import { ref, computed } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useProfileStore } from '@/stores/profile';
import { storeToRefs } from 'pinia';
import { type Transaction } from '@/types';
import { TransactionFormModal } from '@/components/transactions';

const transactionsStore = useTransactionsStore();
const profileStore = useProfileStore();

const { transactions } = storeToRefs(transactionsStore);
const { profile } = storeToRefs(profileStore);

const isModalOpen = ref(false);
const editingTransaction = ref<Transaction | null>(null);
const searchQuery = ref('');

// Transacciones agrupadas por fecha
const groupedTransactions = computed(() => {
  const filtered = transactions.value.filter(t => {
    if (!searchQuery.value) return true;
    const query = searchQuery.value.toLowerCase();
    return t.description.toLowerCase().includes(query) || 
           t.category.toLowerCase().includes(query);
  });

  const groups: { [key: string]: Transaction[] } = {};
  
  filtered.forEach(transaction => {
    const date = new Date(transaction.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let key: string;
    if (date.toDateString() === today.toDateString()) {
      key = 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Ayer';
    } else {
      key = date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(transaction);
  });

  return Object.entries(groups).map(([label, transactions]) => ({
    date: transactions[0].date,
    label,
    transactions: transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
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

// Obtener icono según categoría
const getCategoryIcon = (category: string, type: string) => {
  if (type === 'income') return cashOutline;
  
  const iconMap: Record<string, any> = {
    'Alimentación': restaurantOutline,
    'Transporte': carOutline,
    'Vivienda': homeOutline,
    'Entretenimiento': tvOutline,
    'Salud': medkitOutline,
    'Educación': schoolOutline,
    'Ropa': shirtOutline,
    'Servicios': cardOutline,
    'Otros gastos': cartOutline
  };
  return iconMap[category] || cartOutline;
};

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

/* Search Bar */
.search-container {
  padding: 12px 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--ion-card-background, #fff);
  border-radius: 12px;
  height: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-icon {
  font-size: 24px;
  color: var(--ion-color-medium);
  margin: 0 16px 0 16px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: var(--ion-text-color);
  padding-right: 16px;
}

.search-input::placeholder {
  color: var(--ion-color-medium);
}

/* Filters Row */
.filters-row {
  display: flex;
  gap: 12px;
  padding: 0 16px 16px 16px;
  overflow-x: auto;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 24px;
  border: none;
  background: var(--ion-color-light);
  color: var(--ion-text-color);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:active {
  transform: scale(0.95);
}

.filter-chip.primary {
  background: rgba(32, 201, 151, 0.2);
}

.filter-chip ion-icon {
  font-size: 18px;
}

/* Transaction List */
.transactions-list {
  padding: 0 16px 100px 16px;
}

.transaction-group {
  margin-bottom: 16px;
}

.group-header {
  font-size: 14px;
  font-weight: 700;
  color: var(--ion-color-medium);
  text-transform: capitalize;
  margin: 16px 0 8px 0;
  letter-spacing: 0.5px;
}

.transaction-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: var(--ion-card-background, #fff);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.transaction-item:active {
  transform: scale(0.98);
}

.transaction-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.transaction-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
}

.transaction-icon.icon-expense {
  background: var(--ion-color-light);
  color: var(--ion-text-color);
}

.transaction-icon.icon-income {
  background: rgba(32, 201, 151, 0.2);
  color: #20C997;
}

.transaction-details {
  flex: 1;
  min-width: 0;
}

.transaction-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: var(--ion-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-category {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-amount {
  flex-shrink: 0;
}

.amount-text {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.amount-text.amount-income {
  color: #20C997;
}

.amount-text.amount-expense {
  color: var(--ion-text-color);
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

  .transactions-list {
    padding: 0 32px 100px 32px;
  }

  .transaction-items {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (min-width: 1200px) {
  .transaction-items {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
