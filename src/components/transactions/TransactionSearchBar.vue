<template>
  <div class="search-container">
    <div class="search-bar">
      <ion-icon :icon="searchOutline" class="search-icon"></ion-icon>
      <input 
        type="text" 
        class="search-input" 
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';

interface Props {
  modelValue: string;
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar...'
});

defineEmits<{
  'update:modelValue': [value: string]
}>();
</script>

<style scoped>
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
</style>
