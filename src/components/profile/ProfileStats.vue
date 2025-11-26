<template>
  <section class="profile-section">
    <h2 class="section-title">Estadísticas</h2>
    <div class="stats-grid">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="stat-card"
        :class="{ 'full-width': stat.fullWidth }"
      >
        <div class="stat-icon-wrapper" :class="stat.iconClass">
          <ion-icon :icon="stat.icon" class="stat-icon"></ion-icon>
        </div>
        <div class="stat-content">
          <p class="stat-label">{{ stat.label }}</p>
          <p class="stat-value">{{ stat.value }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  iconClass: string;
  fullWidth?: boolean;
}

interface Props {
  stats: Stat[];
}

defineProps<Props>();
</script>

<style scoped>
.profile-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0;
  letter-spacing: -0.5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--ion-card-background, #fff);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--ion-border-color, #e0e0e0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-card.full-width {
  grid-column: 1 / -1;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.transactions {
  background: rgba(32, 201, 151, 0.2);
}

.stat-icon-wrapper.budgets {
  background: rgba(59, 130, 246, 0.2);
}

.stat-icon-wrapper.balance {
  background: rgba(251, 191, 36, 0.2);
}

.stat-icon {
  font-size: 24px;
}

.stat-icon-wrapper.transactions .stat-icon {
  color: #20C997;
}

.stat-icon-wrapper.budgets .stat-icon {
  color: #3B82F6;
}

.stat-icon-wrapper.balance .stat-icon {
  color: #FBBF24;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .stat-card.full-width {
    grid-column: auto;
  }
}
</style>
