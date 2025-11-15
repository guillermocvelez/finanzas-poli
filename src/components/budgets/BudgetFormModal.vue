<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleDismiss">
    <ion-content :fullscreen="true">
      <div class="budget-modal">
        <!-- Top App Bar -->
        <header class="modal-header">
          <button class="back-button" @click="handleDismiss">
            <ion-icon :icon="arrowBackOutline"></ion-icon>
          </button>
          <h1 class="modal-title">{{ budget ? 'Editar' : 'Crear' }} Presupuesto</h1>
          <div class="header-spacer"></div>
        </header>

        <!-- Main Content -->
        <main class="modal-main">
          <form class="modal-form" @submit.prevent="handleSave">
            <!-- Categoría -->
            <label class="form-field">
              <p class="field-label">Categoría</p>
              <select 
                class="field-select"
                v-model="formData.category"
              >
                <option value="" disabled>Selecciona una categoría</option>
                <option 
                  v-for="cat in EXPENSE_CATEGORIES" 
                  :key="cat"
                  :value="cat"
                >
                  {{ cat }}
                </option>
              </select>
            </label>

            <!-- Monto del Presupuesto -->
            <label class="form-field">
              <p class="field-label">Monto del Presupuesto</p>
              <input 
                class="field-input"
                type="number"
                v-model.number="formData.limit"
                placeholder="$0.00"
                step="0.01"
                min="0"
                inputmode="decimal"
              />
            </label>

            <!-- Periodo -->
            <div class="period-section">
              <h3 class="field-label">Período</h3>
              <div class="period-buttons">
                <button
                  type="button"
                  class="period-button"
                  :class="{ active: formData.period === 'weekly' }"
                  @click="formData.period = 'weekly'"
                >
                  Semanal
                </button>
                <button
                  type="button"
                  class="period-button"
                  :class="{ active: formData.period === 'monthly' }"
                  @click="formData.period = 'monthly'"
                >
                  Mensual
                </button>
                <button
                  type="button"
                  class="period-button"
                  :class="{ active: formData.period === 'yearly' }"
                  @click="formData.period = 'yearly'"
                >
                  Anual
                </button>
              </div>
            </div>
          </form>
        </main>

        <!-- Footer with Actions -->
        <footer class="modal-footer">
          <button 
            v-if="budget"
            type="button"
            class="delete-button"
            @click="handleDelete"
          >
            Eliminar Presupuesto
          </button>
          <button 
            type="submit"
            class="save-button"
            :disabled="!isFormValid"
            @click="handleSave"
          >
            {{ budget ? 'Actualizar' : 'Guardar' }} Presupuesto
          </button>
        </footer>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonContent,
  IonIcon,
} from '@ionic/vue';
import {
  arrowBackOutline
} from 'ionicons/icons';
import { ref, computed, watch } from 'vue';
import { EXPENSE_CATEGORIES, type Budget } from '@/types';

interface Props {
  isOpen: boolean;
  budget?: Budget | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', data: Pick<Budget, 'category' | 'limit' | 'period'>): void;
  (e: 'delete', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  budget: null
});

const emit = defineEmits<Emits>();

const formData = ref({
  category: '',
  limit: 0,
  period: 'monthly' as 'weekly' | 'monthly' | 'yearly'
});

const isFormValid = computed(() => {
  return formData.value.category && 
         formData.value.limit > 0;
});

// Watch para cargar datos cuando se edita un presupuesto
watch(() => props.budget, (newBudget) => {
  if (newBudget && newBudget.id) {
    formData.value = {
      category: newBudget.category,
      limit: newBudget.limit,
      period: newBudget.period
    };
  }
});

// Watch para resetear el formulario cuando se abre el modal
watch(() => props.isOpen, (isOpen, wasOpen) => {
  if (isOpen && !wasOpen) {
    if (!props.budget) {
      resetForm();
    }
  }
});

const resetForm = () => {
  formData.value = {
    category: '',
    limit: 0,
    period: 'monthly'
  };
};

const handleDismiss = () => {
  emit('close');
};

const handleSave = () => {
  if (!isFormValid.value) return;

  emit('save', {
    ...formData.value,
    limit: Number(formData.value.limit)
  });
};

const handleDelete = () => {
  if (props.budget) {
    emit('delete', props.budget.id);
  }
};
</script>

<style scoped>
.budget-modal {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--ion-background-color);
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  background: var(--ion-background-color);
  padding: 16px;
  padding-bottom: 8px;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  display: flex;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--ion-text-color);
  cursor: pointer;
  font-size: 24px;
  transition: background 0.2s;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  flex: 1;
  text-align: center;
  padding-right: 40px;
  margin: 0;
  color: var(--ion-text-color);
}

.header-spacer {
  width: 40px;
}

/* Main Content */
.modal-main {
  flex-grow: 1;
  padding: 0 16px;
  padding-top: 16px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Form Fields */
.form-field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.field-label {
  color: var(--ion-color-medium);
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  padding-bottom: 8px;
  margin: 0;
}

.field-input,
.field-select {
  display: flex;
  width: 100%;
  min-width: 0;
  flex: 1;
  resize: none;
  overflow: hidden;
  border-radius: 8px;
  color: var(--ion-text-color);
  border: 1px solid var(--ion-border-color, #e0e0e0);
  background: var(--ion-background-color);
  height: 56px;
  padding: 16px;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  transition: all 0.2s;
}

.field-input::placeholder,
.field-select::placeholder {
  color: var(--ion-color-medium);
}

.field-input:focus,
.field-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.5);
  border-color: #2ECC71;
}

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238E8E93' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  cursor: pointer;
}

/* Period Section */
.period-section {
  padding-top: 16px;
}

.period-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.period-button {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--ion-border-color, #e0e0e0);
  color: var(--ion-text-color);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.period-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.period-button.active {
  background: #2ECC71;
  color: white;
  border-color: #2ECC71;
}

/* Footer */
.modal-footer {
  padding: 24px 16px;
  background: var(--ion-background-color);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.save-button,
.delete-button {
  width: 100%;
  font-weight: 700;
  height: 56px;
  border-radius: 12px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button {
  background: #2ECC71;
  color: white;
}

.save-button:hover:not(:disabled) {
  background: #27AE60;
}

.save-button:disabled {
  background: var(--ion-color-light);
  color: var(--ion-color-medium);
  cursor: not-allowed;
}

.delete-button {
  background: transparent;
  color: #EF4444;
  border: 1px solid #EF4444;
}

.delete-button:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Responsive */
@media (min-width: 768px) {
  .budget-modal {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
