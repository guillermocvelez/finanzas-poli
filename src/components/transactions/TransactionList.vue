<template>
  <div class="transactions-list">
    <div v-if="groupedTransactions.length > 0">
      <div v-for="group in groupedTransactions" :key="group.date" class="transaction-group">
        <h4 class="group-header">{{ group.label }}</h4>
        
        <div class="transaction-items">
          <div 
            v-for="transaction in group.transactions" 
            :key="transaction.id"
            class="transaction-item"
            @click="$emit('transaction-click', transaction)"
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
      <p class="empty-text">{{ emptyMessage }}</p>
      <ion-button @click="$emit('add-transaction')" class="empty-button">
        {{ emptyButtonText }}
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';
import {
  walletOutline,
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
import { computed } from 'vue';
import type { Transaction } from '@/types';

interface TransactionGroup {
  date: string;
  label: string;
  transactions: Transaction[];
}

interface Props {
  transactions: Transaction[];
  currency: string;
  searchQuery?: string;
  emptyMessage?: string;
  emptyButtonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  emptyMessage: 'No hay transacciones registradas',
  emptyButtonText: 'Agregar primera transacción'
});

defineEmits<{
  'transaction-click': [transaction: Transaction]
  'add-transaction': []
}>();

const groupedTransactions = computed<TransactionGroup[]>(() => {
  const filtered = props.transactions.filter(t => {
    if (!props.searchQuery) return true;
    const query = props.searchQuery.toLowerCase();
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
    currency: props.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

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
</script>

<style scoped>
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
