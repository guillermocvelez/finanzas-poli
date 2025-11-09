<template>
  <ion-page>
    <div class="layout-container">
      <!-- Sidebar para desktop -->
      <aside class="sidebar desktop-only">
        <div class="sidebar-header">
          <h1>💰 Finanzas</h1>
        </div>
        <nav class="sidebar-nav">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path" 
            class="nav-item"
            :class="{ active: isActive(item.path) }"
          >
            <ion-icon :icon="item.icon"></ion-icon>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- Contenido principal -->
      <div class="main-content">
        <ion-tabs class="mobile-only">
          <ion-router-outlet></ion-router-outlet>
          <ion-tab-bar slot="bottom">
            <ion-tab-button tab="dashboard" href="/tabs/dashboard">
              <ion-icon :icon="gridOutline" />
              <ion-label>Dashboard</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="transactions" href="/tabs/transactions">
              <ion-icon :icon="receiptOutline" />
              <ion-label>Transacciones</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="budgets" href="/tabs/budgets">
              <ion-icon :icon="pieChartOutline" />
              <ion-label>Presupuestos</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="profile" href="/tabs/profile">
              <ion-icon :icon="personOutline" />
              <ion-label>Perfil</ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>

        <div class="desktop-only desktop-content">
          <ion-router-outlet></ion-router-outlet>
        </div>
      </div>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/vue';
import { gridOutline, receiptOutline, pieChartOutline, personOutline } from 'ionicons/icons';
import { useRoute } from 'vue-router';

const route = useRoute();

const menuItems = [
  { path: '/tabs/dashboard', icon: gridOutline, label: 'Dashboard' },
  { path: '/tabs/transactions', icon: receiptOutline, label: 'Transacciones' },
  { path: '/tabs/budgets', icon: pieChartOutline, label: 'Presupuestos' },
  { path: '/tabs/profile', icon: personOutline, label: 'Perfil' }
];

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* Sidebar para desktop */
.sidebar {
  width: 260px;
  background: var(--ion-background-color, #fff);
  border-right: 1px solid var(--ion-border-color, #e0e0e0);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid var(--ion-border-color, #e0e0e0);
}

.sidebar-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: var(--ion-text-color, #000);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-item:hover {
  background: var(--ion-color-light, #f4f5f8);
}

.nav-item.active {
  background: var(--ion-color-primary-tint, #e0e7ff);
  color: var(--ion-color-primary, #3880ff);
  font-weight: 600;
  border-left: 3px solid var(--ion-color-primary, #3880ff);
}

.nav-item ion-icon {
  font-size: 24px;
}

.nav-item span {
  font-size: 1rem;
}

/* Contenido principal */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Responsive */
.mobile-only {
  display: block;
}

.desktop-only {
  display: none;
}

.desktop-content {
  flex: 1;
  overflow: auto;
}

/* Media query para desktop */
@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
  
  .desktop-only {
    display: block;
  }

  .main-content {
    margin-left: 260px;
  }
}

/* Media query para tablets */
@media (min-width: 768px) and (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }

  .main-content {
    margin-left: 220px;
  }
}
</style>
