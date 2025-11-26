# Guía de Implementación: Google OAuth Real

## Opción 1: Firebase Authentication (Recomendado) ✅

Firebase funciona perfectamente en Web, iOS y Android con Capacitor.

### Paso 1: Instalación

```bash
npm install firebase
```

### Paso 2: Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Authentication** → **Sign-in method** → **Google**
4. Obtén tu configuración web en **Project Settings**

### Paso 3: Crear archivo de configuración

Crea `src/config/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

### Paso 4: Actualizar Store de Auth

Modifica `src/stores/auth.ts`:

```typescript
import { defineStore } from "pinia";
import { ref } from "vue";
import { auth, googleProvider } from "@/config/firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  provider: "google" | "email";
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);

  // Inicializar listener de auth
  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        user.value = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
          photoUrl: firebaseUser.photoURL || undefined,
          provider: "google",
        };
        isAuthenticated.value = true;
        saveToStorage(user.value);
      } else {
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem("auth_user");
      }
    });
  };

  // Login con Google
  const loginWithGoogle = async (): Promise<boolean> => {
    isLoading.value = true;
    try {
      // En móvil usar redirect, en web usar popup
      if (Capacitor.isNativePlatform()) {
        await signInWithRedirect(auth, googleProvider);
        // El resultado se maneja en getRedirectResult al iniciar
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        user.value = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
          photoUrl: firebaseUser.photoURL || undefined,
          provider: "google",
        };
        isAuthenticated.value = true;
        saveToStorage(user.value);
      }

      return true;
    } catch (error) {
      console.error("Error during Google login:", error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Manejar resultado de redirect (para móvil)
  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const firebaseUser = result.user;
        user.value = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
          photoUrl: firebaseUser.photoURL || undefined,
          provider: "google",
        };
        isAuthenticated.value = true;
        saveToStorage(user.value);
      }
    } catch (error) {
      console.error("Error handling redirect:", error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
      isAuthenticated.value = false;
      localStorage.removeItem("auth_user");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const saveToStorage = (userData: User) => {
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  const loadFromStorage = () => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        user.value = JSON.parse(stored);
        isAuthenticated.value = true;
      } catch (error) {
        console.error("Error loading auth data:", error);
      }
    }
  };

  // Inicializar
  loadFromStorage();
  initAuth();
  handleRedirectResult();

  return {
    user,
    isAuthenticated,
    isLoading,
    loginWithGoogle,
    logout,
  };
});
```

### Paso 5: Configurar Android (para APK)

1. **Obtener SHA-1 de tu certificado de debug**:

```bash
cd android
./gradlew signingReport
```

2. En Firebase Console:

   - **Project Settings** → **Your apps** → **Add app** → Android
   - Package name: `io.ionic.starter` (o el que tengas en `capacitor.config.ts`)
   - Agrega el SHA-1 del paso anterior
   - Descarga `google-services.json`
   - Colócalo en `android/app/google-services.json`

3. **Modificar `android/build.gradle`**:

```gradle
buildscript {
    dependencies {
        // ... otras dependencias
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

4. **Modificar `android/app/build.gradle`**:

```gradle
// Al final del archivo
apply plugin: 'com.google.gms.google-services'
```

### Paso 6: Actualizar capacitor.config.ts

```typescript
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter", // Debe coincidir con Firebase
  appName: "finanzas",
  webDir: "dist",
  android: {
    allowMixedContent: true,
  },
  plugins: {
    StatusBar: {
      style: "light",
      backgroundColor: "#ffffff",
      overlaysWebView: false,
    },
  },
};

export default config;
```

### Paso 7: Sincronizar

```bash
npm run build
npx cap sync android
```

---

## Opción 2: Google One Tap (Solo Web) 🌐

Para solo web, puedes usar Google One Tap que es más simple:

### Instalación:

```bash
npm install @types/google.accounts
```

### Implementación en LoginPage.vue:

```typescript
import { onMounted } from "vue";

onMounted(() => {
  // Cargar script de Google
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: "TU_CLIENT_ID.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
  };
});

const handleCredentialResponse = async (response: any) => {
  // response.credential contiene el JWT token
  const decoded = parseJwt(response.credential);

  const googleUser: User = {
    id: decoded.sub,
    email: decoded.email,
    name: decoded.name,
    photoUrl: decoded.picture,
    provider: "google",
  };

  // Guardar en store
  authStore.user = googleUser;
  authStore.isAuthenticated = true;
  router.push("/tabs/dashboard");
};

const parseJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(base64));
};
```

Y actualizar el botón de Google:

```html
<div
  id="g_id_onload"
  data-client_id="TU_CLIENT_ID.apps.googleusercontent.com"
  data-callback="handleCredentialResponse"
></div>
<div
  class="g_id_signin"
  data-type="standard"
  data-size="large"
  data-theme="outline"
  data-text="signin_with"
  data-shape="rectangular"
  data-logo_alignment="left"
></div>
```

---

## Pasos Generales para Obtener Credenciales

### 1. Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita **Google+ API**
4. Ve a **APIs & Services** → **Credentials**
5. Crea **OAuth 2.0 Client IDs**:
   - **Web application**: Para desarrollo web
   - **Android**: Para APK (necesitas SHA-1)

### 2. Configurar Orígenes Autorizados

- **Web**:

  - `http://localhost:5173`
  - `http://localhost:8100`
  - Tu dominio de producción

- **Android**:
  - Agrega el Package Name
  - Agrega el SHA-1 fingerprint

---

## Recomendación Final 🎯

**Usa Firebase Authentication** porque:

✅ Funciona en Web, iOS y Android
✅ Maneja automáticamente tokens y sesiones
✅ Incluye otros métodos de auth (email, Facebook, etc.)
✅ Integración sencilla con Capacitor
✅ Documentación excelente
✅ Gratis hasta 10,000 usuarios/mes

## Testing

### En Web:

```bash
npm run dev
# Navega a http://localhost:5173
```

### En Android:

```bash
npm run build
npx cap sync android
npx cap open android
# Build APK y prueba en dispositivo real
```

**Nota**: Google Sign-In NO funciona en emuladores de Android, necesitas un dispositivo físico.

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"

- Verifica que el Client ID sea correcto
- Asegúrate de que el dominio esté en orígenes autorizados

### Error en Android: "Sign in failed"

- Verifica que el SHA-1 esté agregado en Firebase Console
- Verifica que el package name coincida
- Asegúrate de que `google-services.json` esté en la ubicación correcta

### Error: "Network Error"

- Verifica conexión a internet
- Asegúrate de que las APIs estén habilitadas en Google Cloud Console

## Recursos

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google Sign-In for Web](https://developers.google.com/identity/gsi/web)
- [Capacitor with Firebase](https://capacitorjs.com/docs/guides/firebase)
