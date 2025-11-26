import { defineStore } from "pinia";
import { ref } from "vue";

// VERSIÓN CON FIREBASE - Descomenta después de instalar Firebase
// Paso 1: npm install firebase
// Paso 2: Configura src/config/firebase.ts con tus credenciales
// Paso 3: Descomenta las líneas de abajo y comenta la versión simulada

/*
import { auth, googleProvider } from "@/config/firebase";
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { Capacitor } from '@capacitor/core';
*/

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

  // ==================== VERSIÓN SIMULADA (ACTUAL) ====================
  // Elimina esta sección cuando uses Firebase

  const loadFromStorage = () => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        user.value = userData;
        isAuthenticated.value = true;
      } catch (error) {
        console.error("Error loading auth data:", error);
        logout();
      }
    }
  };

  const saveToStorage = (userData: User) => {
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    isLoading.value = true;
    try {
      // Simulación - reemplazar con Firebase
      const googleUser: User = {
        id: "google_" + Date.now(),
        email: "usuario@gmail.com",
        name: "Usuario Google",
        photoUrl:
          "https://ui-avatars.com/api/?name=Usuario+Google&background=20C997&color=fff",
        provider: "google",
      };

      user.value = googleUser;
      isAuthenticated.value = true;
      saveToStorage(googleUser);

      return true;
    } catch (error) {
      console.error("Error during Google login:", error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const loginWithEmail = async (email: string): Promise<boolean> => {
    isLoading.value = true;
    try {
      const emailUser: User = {
        id: "email_" + Date.now(),
        email: email,
        name: email.split("@")[0],
        provider: "email",
      };

      user.value = emailUser;
      isAuthenticated.value = true;
      saveToStorage(emailUser);

      return true;
    } catch (error) {
      console.error("Error during email login:", error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("auth_user");
  };

  loadFromStorage();

  // ==================== FIN VERSIÓN SIMULADA ====================

  /* ==================== VERSIÓN FIREBASE (COMENTADA) ====================
  // Descomenta esta sección cuando instales y configures Firebase
  
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

  // Convertir FirebaseUser a nuestro User
  const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuario",
      photoUrl: firebaseUser.photoURL || undefined,
      provider: "google"
    };
  };

  // Inicializar listener de auth
  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        user.value = convertFirebaseUser(firebaseUser);
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
        // El resultado se maneja en handleRedirectResult al iniciar
        return true;
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        
        user.value = convertFirebaseUser(firebaseUser);
        isAuthenticated.value = true;
        saveToStorage(user.value);
        
        return true;
      }
    } catch (error: any) {
      console.error("Error during Google login:", error);
      
      // Manejar errores comunes
      if (error.code === 'auth/popup-blocked') {
        console.error('Popup bloqueado por el navegador');
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.error('Popup cerrado por el usuario');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.error('Solicitud de popup cancelada');
      }
      
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
        user.value = convertFirebaseUser(firebaseUser);
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

  // Inicializar
  loadFromStorage();
  initAuth();
  
  // Solo en móvil: manejar resultado de redirect al iniciar
  if (Capacitor.isNativePlatform()) {
    handleRedirectResult();
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    loginWithGoogle,
    logout,
  };
  */
  // ==================== FIN VERSIÓN FIREBASE ====================

  return {
    user,
    isAuthenticated,
    isLoading,
    loginWithGoogle,
    loginWithEmail,
    logout,
  };
});
