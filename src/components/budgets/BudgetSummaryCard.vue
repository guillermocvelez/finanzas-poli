<template>
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
</template>

<script setup lang="ts">
interface Props {
  totalSpent: number;
  totalBudget: number;
  overallPercentage: number;
  currency: string;
}

const props = defineProps<Props>();

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return 'progress-danger';
  if (percentage >= 80) return 'progress-warning';
  return 'progress-success';
};
</script>

<style scoped>
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
</style>
