<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { StatusBar, Style } from '@capacitor/status-bar';
import { onMounted } from 'vue';

onMounted(async () => {
  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (error) {
    // StatusBar no disponible en web
    console.log('StatusBar not available');
  }
});
</script>

<style>
/* Safe area para dispositivos móviles */
ion-content {
  --padding-top: env(safe-area-inset-top);
}

/* Ajuste para headers sticky */
.top-bar,
.dashboard-header {
  padding-top: calc(16px + env(safe-area-inset-top)) !important;
}
</style>
