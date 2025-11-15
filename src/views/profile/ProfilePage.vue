<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="profile-page">
        <!-- Top App Bar -->
        <header class="top-bar">
          <div class="header-start"></div>
          <h1 class="page-title">Perfil</h1>
          <div class="header-end"></div>
        </header>

        <main class="main-content">
          <!-- Información del Usuario -->
          <section class="profile-section">
            <h2 class="section-title">Información Personal</h2>
            <div class="form-fields">
              <div class="form-field">
                <label class="field-label">Nombre</label>
                <input
                  class="field-input"
                  v-model="localProfile.name"
                  placeholder="Tu nombre"
                  type="text"
                />
              </div>

              <div class="form-field">
                <label class="field-label">Email</label>
                <input
                  class="field-input"
                  v-model="localProfile.email"
                  type="email"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </section>

          <!-- Preferencias -->
          <section class="profile-section">
            <h2 class="section-title">Preferencias</h2>
            <div class="form-fields">
              <div class="form-field">
                <label class="field-label">Moneda</label>
                <select class="field-select" v-model="localProfile.currency">
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="USD">USD - Dólar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                </select>
              </div>

              <div class="form-field">
                <label class="field-label">Tema</label>
                <select class="field-select" v-model="localProfile.theme">
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Estadísticas -->
          <section class="profile-section">
            <h2 class="section-title">Estadísticas</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon-wrapper transactions">
                  <ion-icon :icon="receiptOutline" class="stat-icon"></ion-icon>
                </div>
                <div class="stat-content">
                  <p class="stat-label">Transacciones</p>
                  <p class="stat-value">{{ transactions.length }}</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon-wrapper budgets">
                  <ion-icon :icon="walletOutline" class="stat-icon"></ion-icon>
                </div>
                <div class="stat-content">
                  <p class="stat-label">Presupuestos</p>
                  <p class="stat-value">{{ budgetsWithProgress.length }}</p>
                </div>
              </div>

              <div class="stat-card full-width">
                <div class="stat-icon-wrapper balance">
                  <ion-icon :icon="trendingUpOutline" class="stat-icon"></ion-icon>
                </div>
                <div class="stat-content">
                  <p class="stat-label">Balance Actual</p>
                  <p class="stat-value">{{ formatCurrency(balance) }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Acciones -->
          <section class="profile-section">
            <button class="danger-button" @click="confirmClearData">
              <ion-icon :icon="trashOutline"></ion-icon>
              <span>Borrar todos los datos</span>
            </button>
          </section>

          <!-- Botón Guardar -->
          <div class="save-button-container">
            <button 
              class="save-button" 
              @click="saveProfile" 
              :disabled="!hasChanges"
            >
              Guardar Cambios
            </button>
          </div>
        </main>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonIcon,
  alertController,
  toastController
} from '@ionic/vue';
import { 
  receiptOutline, 
  walletOutline, 
  trendingUpOutline, 
  trashOutline 
} from 'ionicons/icons';
import { ref, watch } from 'vue';
import { useProfileStore } from '@/stores/profile';
import { useTransactionsStore } from '@/stores/transactions';
import { useBudgetsStore } from '@/stores/budgets';
import { storeToRefs } from 'pinia';

const profileStore = useProfileStore();
const transactionsStore = useTransactionsStore();
const budgetsStore = useBudgetsStore();

const { profile } = storeToRefs(profileStore);
const { transactions, balance } = storeToRefs(transactionsStore);
const { budgetsWithProgress } = storeToRefs(budgetsStore);

const localProfile = ref({ ...profile.value });
const hasChanges = ref(false);

watch(localProfile, () => {
  hasChanges.value = JSON.stringify(localProfile.value) !== JSON.stringify(profile.value);
}, { deep: true });

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: localProfile.value.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const saveProfile = async () => {
  profileStore.updateProfile(localProfile.value);
  hasChanges.value = false;

  const toast = await toastController.create({
    message: 'Perfil actualizado correctamente',
    duration: 2000,
    color: 'success',
    position: 'bottom'
  });
  await toast.present();
};

const confirmClearData = async () => {
  const alert = await alertController.create({
    header: 'Confirmar eliminación',
    message: '¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Borrar todo',
        role: 'destructive',
        handler: async () => {
          localStorage.clear();
          
          // Reiniciar stores
          transactions.value = [];
          budgetsStore.budgets = [];
          
          const toast = await toastController.create({
            message: 'Todos los datos han sido eliminados',
            duration: 2000,
            color: 'success',
            position: 'bottom'
          });
          await toast.present();
        }
      }
    ]
  });

  await alert.present();
};
</script>

<style scoped>
.profile-page {
  min-height: 100%;
  background: var(--ion-background-color);
}

/* Top Bar */
.top-bar {
  display: flex;
  align-items: center;
  padding: 16px;
  padding-bottom: 12px;
  background: var(--ion-background-color);
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-start,
.header-end {
  width: 40px;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  flex: 1;
  margin: 0;
  color: var(--ion-text-color);
  letter-spacing: -0.5px;
}

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  padding: 0 16px 100px 16px;
  gap: 24px;
}

/* Sections */
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

/* Form Fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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

.field-input,
.field-select {
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

.field-input:focus,
.field-select:focus {
  outline: none;
  border-color: #20C997;
  box-shadow: 0 0 0 2px rgba(32, 201, 151, 0.2);
}

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238E8E93' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  cursor: pointer;
}

/* Stats Grid */
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

/* Buttons */
.danger-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #EF4444;
  background: transparent;
  color: #EF4444;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.danger-button ion-icon {
  font-size: 20px;
}

.danger-button:hover {
  background: rgba(239, 68, 68, 0.1);
}

.save-button-container {
  margin-top: 8px;
}

.save-button {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: #20C997;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
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

/* Responsive */
@media (min-width: 768px) {
  .profile-page {
    max-width: 900px;
    margin: 0 auto;
  }

  .main-content {
    padding: 0 32px 100px 32px;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .stat-card.full-width {
    grid-column: auto;
  }
}

@media (min-width: 1200px) {
  .profile-page {
    max-width: 1200px;
  }
}
</style>
