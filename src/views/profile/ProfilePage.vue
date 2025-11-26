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
          <ProfileSection title="Información Personal">
            <ProfileFormInput
              label="Nombre"
              v-model="localProfile.name"
              placeholder="Tu nombre"
            />
            <ProfileFormInput
              label="Email"
              v-model="localProfile.email"
              type="email"
              placeholder="tu@email.com"
            />
          </ProfileSection>

          <!-- Preferencias -->
          <ProfileSection title="Preferencias">
            <ProfileFormSelect
              label="Moneda"
              v-model="localProfile.currency"
              :options="currencyOptions"
            />
            <ProfileFormSelect
              label="Tema"
              v-model="localProfile.theme"
              :options="themeOptions"
            />
          </ProfileSection>

          <!-- Estadísticas -->
          <ProfileStats :stats="profileStats" />

          <!-- Acciones -->
          <ProfileSection title="Acciones">
            <button class="logout-button" @click="handleLogout">
              <ion-icon :icon="logOutOutline"></ion-icon>
              <span>Cerrar Sesión</span>
            </button>
            <button class="danger-button" @click="confirmClearData">
              <ion-icon :icon="trashOutline"></ion-icon>
              <span>Borrar todos los datos</span>
            </button>
          </ProfileSection>

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
  trashOutline,
  logOutOutline
} from 'ionicons/icons';
import { ref, watch, computed } from 'vue';
import { useProfileStore } from '@/stores/profile';
import { useTransactionsStore } from '@/stores/transactions';
import { useBudgetsStore } from '@/stores/budgets';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  ProfileSection,
  ProfileFormInput,
  ProfileFormSelect,
  ProfileStats
} from '@/components/profile';

const profileStore = useProfileStore();
const transactionsStore = useTransactionsStore();
const budgetsStore = useBudgetsStore();
const authStore = useAuthStore();
const router = useRouter();

const { profile } = storeToRefs(profileStore);
const { transactions, balance } = storeToRefs(transactionsStore);
const { budgetsWithProgress } = storeToRefs(budgetsStore);

const localProfile = ref({ ...profile.value });
const hasChanges = ref(false);

const currencyOptions = [
  { value: 'COP', label: 'COP - Peso Colombiano' },
  { value: 'USD', label: 'USD - Dólar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'MXN', label: 'MXN - Peso Mexicano' }
];

const themeOptions = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Sistema' }
];

const profileStats = computed(() => [
  {
    label: 'Transacciones',
    value: transactions.value.length,
    icon: receiptOutline,
    iconClass: 'transactions'
  },
  {
    label: 'Presupuestos',
    value: budgetsWithProgress.value.length,
    icon: walletOutline,
    iconClass: 'budgets'
  },
  {
    label: 'Balance Actual',
    value: formatCurrency(balance.value),
    icon: trendingUpOutline,
    iconClass: 'balance',
    fullWidth: true
  }
]);

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

const handleLogout = async () => {
  const alert = await alertController.create({
    header: 'Cerrar Sesión',
    message: '¿Estás seguro de que quieres cerrar sesión?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Cerrar Sesión',
        role: 'confirm',
        handler: () => {
          authStore.logout();
          router.push('/login');
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

/* Buttons */
.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px 20px;
  border-radius: 12px;
  border: none;
  background: var(--ion-card-background, #fff);
  color: #3B82F6;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: scale(1);
}

.logout-button ion-icon {
  font-size: 22px;
}

.logout-button:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.logout-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.danger-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px 20px;
  border-radius: 12px;
  border: none;
  background: var(--ion-card-background, #fff);
  color: #EF4444;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: scale(1);
}

.danger-button ion-icon {
  font-size: 22px;
}

.danger-button:hover {
  background: rgba(239, 68, 68, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}

.danger-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
}

@media (min-width: 1200px) {
  .profile-page {
    max-width: 1200px;
  }
}
</style>
