<template>
  <div class="balance-card">
    <p class="balance-label" :key="`label-${selectedCategory}`">
      {{ categoryLabel }}
    </p>
    <h1 class="balance-amount" :key="`amount-${selectedCategory}`">
      {{ formatCurrency(currentBalance) }}
    </h1>
    
    <div class="segment-control">
      <button 
        v-for="category in categories"
        :key="category.id"
        class="segment-btn" 
        :class="{ active: selectedCategory === category.id }"
        @click="$emit('select-category', category.id)"
      >
        {{ category.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Category {
  id: string;
  label: string;
}

interface Props {
  selectedCategory: string;
  currentBalance: number;
  currency: string;
  categories?: Category[];
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [
    { id: 'cuentas', label: 'Cuentas' },
    { id: 'ahorros', label: 'Ahorros' },
    { id: 'inversiones', label: 'Inversiones' }
  ]
});

defineEmits<{
  'select-category': [category: string]
}>();

const categoryLabel = computed(() => {
  const labels: Record<string, string> = {
    cuentas: 'Saldo en Cuentas',
    ahorros: 'Saldo en Ahorros',
    inversiones: 'Saldo en Inversiones'
  };
  return labels[props.selectedCategory] || 'Saldo Total';
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
</script>

<style scoped>
.balance-card {
  background: var(--ion-card-background, #fff);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.balance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.balance-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0 0 12px 0;
  animation: labelUpdate 0.3s ease-out;
}

@keyframes labelUpdate {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.balance-amount {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 0 0 20px 0;
  color: var(--ion-text-color);
  animation: balanceUpdate 0.4s ease-out;
  transform-origin: left center;
}

@keyframes balanceUpdate {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-5px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
}

.segment-btn:hover {
  color: var(--ion-text-color);
  transform: scale(1.02);
}

.segment-btn.active {
  background: var(--ion-card-background, #fff);
  color: var(--ion-text-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.segment-btn:active {
  transform: scale(0.98);
}

@media (min-width: 768px) {
  .balance-amount {
    font-size: 48px;
  }
}
</style>
