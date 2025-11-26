<template>
  <div class="filters-row">
    <button class="filter-chip primary" @click="$emit('toggle-filters')">
      <ion-icon :icon="optionsOutline"></ion-icon>
      <span>Filtros</span>
      <ion-icon :icon="chevronDownOutline"></ion-icon>
    </button>
    <button class="filter-chip" @click="$emit('toggle-sort')">
      <ion-icon :icon="swapVerticalOutline"></ion-icon>
      <span>Ordenar</span>
      <ion-icon :icon="chevronDownOutline"></ion-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import {
  optionsOutline,
  swapVerticalOutline,
  chevronDownOutline
} from 'ionicons/icons';

defineEmits<{
  'toggle-filters': []
  'toggle-sort': []
}>();
</script>

<style scoped>
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
</style>
