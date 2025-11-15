<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleDismiss">
    <ion-content :fullscreen="true">
      <div 
        class="transaction-modal" 
        :class="formData.type === 'expense' ? 'is-expense' : 'is-income'"
      >
        <!-- Top App Bar -->
        <header class="modal-header">
          <button class="close-button" @click="handleDismiss">
            <ion-icon :icon="closeOutline"></ion-icon>
          </button>
          <h1 class="modal-title">{{ transaction ? 'Editar' : 'Nueva' }} Transacción</h1>
          <div class="header-spacer"></div>
        </header>

        <main class="modal-main">
          <!-- Segmented Buttons -->
          <div class="segment-container">
            <div class="segment-wrapper">
              <label 
                class="segment-option"
                :class="{ active: formData.type === 'expense' }"
              >
                <span>Gasto</span>
                <input 
                  type="radio" 
                  value="expense"
                  v-model="formData.type"
                  @change="onTypeChange"
                  class="segment-input"
                />
              </label>
              <label 
                class="segment-option"
                :class="{ active: formData.type === 'income' }"
              >
                <span>Ingreso</span>
                <input 
                  type="radio" 
                  value="income"
                  v-model="formData.type"
                  @change="onTypeChange"
                  class="segment-input"
                />
              </label>
            </div>
          </div>

          <!-- Headline Amount -->
          <div class="amount-display">
            <h2 
              v-if="formData.type === 'expense'" 
              class="amount-text expense-amount"
            >
              -{{ formatCurrency(formData.amount) }}
            </h2>
            <h2 
              v-else 
              class="amount-text income-amount"
            >
              +{{ formatCurrency(formData.amount) }}
            </h2>
          </div>

          <!-- Category Section -->
          <div class="category-section">
            <h3 class="section-title">Categoría</h3>
            <div class="category-chips">
              <div 
                v-for="cat in availableCategories" 
                :key="cat"
                class="category-chip"
                :class="{ 
                  'chip-selected': formData.category === cat,
                  'chip-expense': formData.type === 'expense' && formData.category === cat,
                  'chip-income': formData.type === 'income' && formData.category === cat
                }"
                @click="formData.category = cat"
              >
                <ion-icon :icon="getCategoryIcon(cat)"></ion-icon>
                <p>{{ cat }}</p>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="form-fields">
            <!-- Amount Input (hidden, controlled by numpad) -->
            <div class="form-field">
              <label class="field-label" for="amount">Monto</label>
              <input 
                id="amount"
                class="field-input"
                type="number"
                v-model.number="formData.amount"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div class="form-field">
              <label class="field-label" for="description">Descripción</label>
              <input 
                id="description"
                class="field-input"
                type="text"
                v-model="formData.description"
                placeholder="Ej: Café con amigos"
              />
            </div>

            <div class="form-field">
              <label class="field-label" for="date">Fecha</label>
              <input 
                id="date"
                class="field-input"
                type="date"
                v-model="formData.date"
              />
            </div>
          </div>
        </main>

        <!-- Action Buttons -->
        <footer class="modal-footer">
          <button 
            v-if="transaction"
            class="delete-button"
            @click="handleDelete"
          >
            Eliminar Transacción
          </button>
          <button 
            class="save-button"
            :disabled="!isFormValid"
            @click="handleSave"
          >
            {{ transaction ? 'Actualizar' : 'Guardar' }} Transacción
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
  closeOutline,
  restaurantOutline,
  carOutline,
  homeOutline,
  tvOutline,
  medkitOutline,
  schoolOutline,
  shirtOutline,
  cartOutline,
  cashOutline,
  briefcaseOutline,
  trendingUpOutline,
  giftOutline
} from 'ionicons/icons';
import { ref, computed, watch } from 'vue';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, type Transaction } from '@/types';

interface Props {
  isOpen: boolean;
  transaction?: Transaction | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', data: Omit<Transaction, 'id'>): void;
  (e: 'delete', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  transaction: null
});

const emit = defineEmits<Emits>();

const formData = ref({
  type: 'expense' as 'income' | 'expense',
  description: '',
  amount: 0,
  category: '',
  date: new Date().toISOString().split('T')[0]
});

const availableCategories = computed(() => {
  return formData.value.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
});

const isFormValid = computed(() => {
  return formData.value.description && 
         formData.value.amount > 0 && 
         formData.value.category &&
         formData.value.date;
});

// Formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Obtener icono según categoría
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    // Gastos
    'Alimentación': restaurantOutline,
    'Transporte': carOutline,
    'Vivienda': homeOutline,
    'Entretenimiento': tvOutline,
    'Salud': medkitOutline,
    'Educación': schoolOutline,
    'Ropa': shirtOutline,
    'Servicios': cartOutline,
    'Otros gastos': cartOutline,
    // Ingresos
    'Salario': cashOutline,
    'Freelance': briefcaseOutline,
    'Inversiones': trendingUpOutline,
    'Regalo': giftOutline,
    'Otros ingresos': cashOutline
  };
  return iconMap[category] || cartOutline;
};

// Watch para cargar datos cuando se edita una transacción
watch(() => props.transaction, (newTransaction) => {
  if (newTransaction && newTransaction.id) {
    formData.value = {
      type: newTransaction.type,
      description: newTransaction.description,
      amount: newTransaction.amount,
      category: newTransaction.category,
      date: newTransaction.date
    };
  }
});

// Watch para resetear el formulario cuando se abre el modal
watch(() => props.isOpen, (isOpen, wasOpen) => {
  if (isOpen && !wasOpen) {
    if (!props.transaction) {
      resetForm();
    }
  }
});

const resetForm = () => {
  formData.value = {
    type: 'expense',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0]
  };
};

const onTypeChange = () => {
  formData.value.category = '';
};

const handleDismiss = () => {
  emit('close');
};

const handleSave = () => {
  if (!isFormValid.value) return;

  emit('save', {
    ...formData.value,
    amount: Number(formData.value.amount)
  });
};

const handleDelete = () => {
  if (props.transaction) {
    emit('delete', props.transaction.id);
  }
};
</script>

<style scoped>
.transaction-modal {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--ion-background-color);
  transition: all 0.3s ease;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  padding: 16px;
  padding-bottom: 8px;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: var(--ion-background-color);
  z-index: 10;
}

.close-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 50%;
  color: var(--ion-text-color);
  cursor: pointer;
  font-size: 24px;
  transition: background 0.2s;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
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
  padding: 0 16px 140px 16px;
}

/* Segmented Control */
.segment-container {
  display: flex;
  padding: 12px 0;
}

.segment-wrapper {
  display: flex;
  height: 48px;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--ion-color-light);
  padding: 6px;
}

.segment-option {
  display: flex;
  cursor: pointer;
  height: 100%;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-medium);
  transition: all 0.3s ease;
}

.segment-option.active {
  background: var(--ion-background-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.is-expense .segment-option.active:has(input[value="expense"]) {
  color: #E57373;
}

.is-income .segment-option.active:has(input[value="income"]) {
  color: #81C784;
}

.segment-input {
  position: absolute;
  width: 0;
  opacity: 0;
  pointer-events: none;
}

/* Amount Display */
.amount-display {
  padding: 24px 0;
}

.amount-text {
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin: 0;
  letter-spacing: -1px;
  transition: color 0.3s ease;
}

.expense-amount {
  color: #E57373;
}

.income-amount {
  color: #81C784;
}

/* Category Section */
.category-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  padding: 0 4px 12px;
  margin: 0;
  color: var(--ion-text-color);
}

.category-chips {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-chips::-webkit-scrollbar {
  display: none;
}

.category-chip {
  display: flex;
  height: 40px;
  flex-shrink: 0;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 20px;
  background: var(--ion-color-light);
  padding: 0 12px 0 12px;
  transition: all 0.3s ease;
}

.category-chip ion-icon {
  font-size: 18px;
  color: var(--ion-text-color);
  transition: color 0.3s ease;
}

.category-chip p {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: var(--ion-text-color);
  transition: color 0.3s ease;
}

.category-chip.chip-expense.chip-selected {
  background: #E57373;
}

.category-chip.chip-income.chip-selected {
  background: #81C784;
}

.category-chip.chip-selected p,
.category-chip.chip-selected ion-icon {
  color: white;
}

/* Form Fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
}

.form-field {
  position: relative;
}

.field-label {
  position: absolute;
  top: -8px;
  left: 12px;
  display: inline-block;
  background: var(--ion-background-color);
  padding: 0 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--ion-color-medium);
}

.field-input {
  display: block;
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--ion-border-color, #e0e0e0);
  background: transparent;
  padding: 14px 16px;
  font-size: 16px;
  color: var(--ion-text-color);
  transition: all 0.2s ease;
}

.field-input::placeholder {
  color: var(--ion-color-medium);
}

.field-input:focus {
  outline: none;
  border-color: #20C997;
  box-shadow: 0 0 0 1px #20C997;
}

/* Footer */
.modal-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, var(--ion-background-color) 70%, transparent);
  padding: 16px;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.save-button,
.delete-button {
  width: 100%;
  font-weight: 700;
  padding: 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.save-button {
  background: #20C997;
  color: white;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}

.save-button:hover:not(:disabled) {
  background: #1ab085;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
}

.save-button:disabled {
  background: var(--ion-color-light);
  color: var(--ion-color-medium);
  cursor: not-allowed;
  box-shadow: none;
}

.delete-button {
  background: transparent;
  color: #EF4444;
  border: 1px solid #EF4444;
}

.delete-button:hover {
  background: rgba(239, 68, 68, 0.1);
}
</style>
