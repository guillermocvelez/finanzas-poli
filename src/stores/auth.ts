import { defineStore } from "pinia";
import { ref } from "vue";

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

  // Cargar desde localStorage
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

  // Guardar en localStorage
  const saveToStorage = (userData: User) => {
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  // Login con Google (simulado para web/móvil)
  const loginWithGoogle = async (): Promise<boolean> => {
    isLoading.value = true;
    try {
      // En producción, aquí integrarías Google Sign-In
      // Por ahora, simulamos el login
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

  // Login con email (simulado)
  const loginWithEmail = async (email: string): Promise<boolean> => {
    isLoading.value = true;
    try {
      // Simulación de login
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

  // Logout
  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("auth_user");
  };

  // Cargar al inicializar
  loadFromStorage();

  return {
    user,
    isAuthenticated,
    isLoading,
    loginWithGoogle,
    loginWithEmail,
    logout,
  };
});
