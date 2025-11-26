<template>
  <div class="form-field">
    <label class="field-label">{{ label }}</label>
    <input
      class="field-input"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :type="type"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  modelValue: string;
  type?: string;
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: ''
});

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

.field-input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--ion-border-color, #e0e0e0);
  background: var(--ion-card-background, #fff);
  padding: 14px 16px;
  font-size: 16px;
  color: var(--ion-text-color);
  transition: all 0.2s;
}

.field-input::placeholder {
  color: var(--ion-color-medium);
}

.field-input:focus {
  outline: none;
  border-color: #20C997;
  box-shadow: 0 0 0 2px rgba(32, 201, 151, 0.2);
}
</style>
