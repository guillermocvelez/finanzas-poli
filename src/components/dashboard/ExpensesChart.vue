<template>
  <div class="expenses-card">
    <p class="card-title">Gastos de {{ currentMonth }}</p>
    <h2 class="expenses-amount">{{ formatCurrency(totalExpenses) }}</h2>
    <div class="expenses-comparison">
      <p class="comparison-label">vs. el mes pasado</p>
      <p class="comparison-value" :class="trend >= 0 ? 'negative' : 'positive'">
        {{ trend >= 0 ? '+' : '' }}{{ trend.toFixed(1) }}%
      </p>
    </div>
    
    <!-- Chart Bars -->
    <div class="chart-container">
      <div v-for="(item, index) in chartData" :key="index" class="chart-bar-wrapper">
        <div class="bar-track" :style="`background-color: ${item.color}20`">
          <div 
            class="bar-fill" 
            :style="`background-color: ${item.color}; width: ${item.percentage}%`"
          ></div>
        </div>
        <p class="bar-label">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChartItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  label: string;
}

interface Props {
  currentMonth: string;
  totalExpenses: number;
  trend: number;
  chartData: ChartItem[];
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
</script>

<style scoped>
.expenses-card {
  background: var(--ion-card-background, #fff);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: var(--ion-text-color);
}

.expenses-amount {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 0 0 8px 0;
  color: var(--ion-text-color);
}

.expenses-comparison {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.comparison-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0;
}

.comparison-value {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}

.comparison-value.positive {
  color: #10B981;
}

.comparison-value.negative {
  color: #EF4444;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding-top: 16px;
}

.chart-bar-wrapper {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 8px;
}

.bar-track {
  width: 100%;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.bar-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--ion-color-medium);
  margin: 0;
  text-align: center;
}

@media (min-width: 768px) {
  .chart-container {
    gap: 24px;
  }
}
</style>
