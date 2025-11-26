<template>
  <div class="form-field">
    <label class="field-label">{{ label }}</label>
    <select 
      class="field-select" 
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  modelValue: string;
  options: SelectOption[];
}

defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: string]
}>();
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  margin-bottom: 8px;
}

.field-select {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--ion-border-color, #e0e0e0);
  background: var(--ion-card-background, #fff);
  padding: 14px 16px;
  font-size: 16px;
  color: var(--ion-text-color);
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238E8E93' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  cursor: pointer;
}

.field-select:focus {
  outline: none;
  border-color: #20C997;
  box-shadow: 0 0 0 2px rgba(32, 201, 151, 0.2);
}
</style>
