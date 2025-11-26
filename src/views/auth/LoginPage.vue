<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="login-container">
        <!-- Logo y Header -->
        <div class="login-header">
          <div class="logo-container">
            <ion-icon :icon="walletOutline" class="logo-icon"></ion-icon>
          </div>
          <h1 class="app-title">Finanzas</h1>
          <p class="app-subtitle">Gestiona tu dinero de manera inteligente</p>
        </div>

        <!-- Formulario de Login -->
        <div class="login-form">
          <!-- Botón de Google -->
          <button 
            class="google-button" 
            @click="handleGoogleLogin"
            :disabled="authStore.isLoading"
          >
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span v-if="!authStore.isLoading">Continuar con Google</span>
            <span v-else>Autenticando...</span>
          </button>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-text">o</span>
          </div>

          <!-- Formulario de Email -->
          <form @submit.prevent="handleEmailLogin" class="email-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="tu@email.com"
                required
                :disabled="authStore.isLoading"
              />
            </div>

            <div class="form-group">
              <label for="password">Contraseña</label>
              <input
                id="password"
                type="password"
                v-model="password"
                placeholder="••••••••"
                required
                :disabled="authStore.isLoading"
              />
            </div>

            <button 
              type="submit" 
              class="login-button"
              :disabled="authStore.isLoading"
            >
              {{ authStore.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </form>

          <!-- Footer -->
          <div class="login-footer">
            <p class="footer-text">
              Al continuar, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonIcon,
  toastController
} from '@ionic/vue';
import { walletOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleGoogleLogin = async () => {
  const success = await authStore.loginWithGoogle();
  
  if (success) {
    const toast = await toastController.create({
      message: '¡Bienvenido! Has iniciado sesión con Google',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
    router.push('/tabs/dashboard');
  } else {
    const toast = await toastController.create({
      message: 'Error al iniciar sesión con Google',
      duration: 2000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }
};

const handleEmailLogin = async () => {
  if (!email.value || !password.value) {
    const toast = await toastController.create({
      message: 'Por favor completa todos los campos',
      duration: 2000,
      color: 'warning',
      position: 'bottom'
    });
    await toast.present();
    return;
  }

  const success = await authStore.loginWithEmail(email.value);
  
  if (success) {
    const toast = await toastController.create({
      message: '¡Bienvenido de nuevo!',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
    router.push('/tabs/dashboard');
  } else {
    const toast = await toastController.create({
      message: 'Error al iniciar sesión',
      duration: 2000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, #20C997 0%, #17a589 100%);
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 48px;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.logo-icon {
  font-size: 48px;
  color: white;
}

.app-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  letter-spacing: -1px;
}

.app-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

/* Formulario */
.login-form {
  width: 100%;
  max-width: 400px;
  background: var(--ion-card-background, #fff);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Botón de Google */
.google-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 20px;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  background: white;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.google-button:hover:not(:disabled) {
  background: #F9FAFB;
  border-color: #D1D5DB;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--ion-color-light);
}

.divider-text {
  padding: 0 16px;
  color: var(--ion-color-medium);
  font-size: 14px;
  font-weight: 500;
}

/* Formulario de Email */
.email-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-text-color);
}

.form-group input {
  padding: 14px 16px;
  border: 1px solid var(--ion-color-light);
  border-radius: 12px;
  font-size: 16px;
  background: var(--ion-card-background, #fff);
  color: var(--ion-text-color);
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #20C997;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Botón de Login */
.login-button {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: #20C997;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
  margin-top: 8px;
}

.login-button:hover:not(:disabled) {
  background: #1ab085;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Footer */
.login-footer {
  margin-top: 24px;
  text-align: center;
}

.footer-text {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin: 0;
  line-height: 1.5;
}

/* Responsive */
@media (min-width: 768px) {
  .login-container {
    padding: 48px;
  }

  .login-form {
    padding: 40px 32px;
  }

  .app-title {
    font-size: 40px;
  }

  .app-subtitle {
    font-size: 18px;
  }
}
</style>
