import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserProfile } from "@/types";

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<UserProfile>({
    name: "Guillermo Castaño",
    email: "guillermoc03@poligran.edu.co",
    currency: "COP",
    theme: "system",
  });

  
  const loadFromStorage = () => {
    const stored = localStorage.getItem("profile");
    if (stored) {
      profile.value = JSON.parse(stored);
    }
  };

  
  const saveToStorage = () => {
    localStorage.setItem("profile", JSON.stringify(profile.value));
  };

  
  const updateProfile = (updates: Partial<UserProfile>) => {
    profile.value = { ...profile.value, ...updates };
    saveToStorage();
  };

  
  loadFromStorage();

  return {
    profile,
    updateProfile,
  };
});
