<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Perfil</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="profile-container">
        <!-- Información del Usuario -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Información Personal</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-input
                  label="Nombre"
                  v-model="localProfile.name"
                  placeholder="Tu nombre"
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-input
                  label="Email"
                  v-model="localProfile.email"
                  type="email"
                  placeholder="tu@email.com"
                ></ion-input>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Configuración de Moneda -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Preferencias</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-select 
                  label="Moneda" 
                  v-model="localProfile.currency"
                >
                  <ion-select-option value="COP">COP - Peso Colombiano</ion-select-option>
                  <ion-select-option value="USD">USD - Dólar</ion-select-option>
                  <ion-select-option value="EUR">EUR - Euro</ion-select-option>
                  <ion-select-option value="MXN">MXN - Peso Mexicano</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-select 
                  label="Tema" 
                  v-model="localProfile.theme"
                >
                  <ion-select-option value="light">Claro</ion-select-option>
                  <ion-select-option value="dark">Oscuro</ion-select-option>
                  <ion-select-option value="system">Sistema</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Estadísticas -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Estadísticas</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-icon :icon="receiptOutline" slot="start" color="primary"></ion-icon>
                <ion-label>
                  <h3>Total de Transacciones</h3>
                  <p>{{ transactions.length }} registradas</p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-icon :icon="walletOutline" slot="start" color="success"></ion-icon>
                <ion-label>
                  <h3>Presupuestos Activos</h3>
                  <p>{{ budgetsWithProgress.length }} configurados</p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-icon :icon="trendingUpOutline" slot="start" color="warning"></ion-icon>
                <ion-label>
                  <h3>Balance Actual</h3>
                  <p>{{ formatCurrency(balance) }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Acciones -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Acciones</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-button expand="block" color="danger" @click="confirmClearData">
              <ion-icon :icon="trashOutline" slot="start"></ion-icon>
              Borrar todos los datos
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Botón Guardar -->
        <div class="save-button-container">
          <ion-button expand="block" @click="saveProfile" :disabled="!hasChanges">
            Guardar Cambios
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
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
.profile-container {
  padding: 16px;
  padding-bottom: 80px;
  max-width: 900px;
  margin: 0 auto;
}

.save-button-container {
  margin-top: 16px;
}

/* Responsive para desktop */
@media (min-width: 768px) {
  .profile-container {
    padding: 24px 32px;
  }
}
</style>
