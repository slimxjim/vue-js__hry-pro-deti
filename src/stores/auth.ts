// src/stores/auth.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue'
import { useUserApi } from '@/composable/useUserApi'
import type { User } from '@/types/calculationTypes'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | undefined | null>(null); // Uchování uživatele
  const isLoggedIn = computed(() => user.value !== null);

  const { login, fetchUserData, logout } = useUserApi();

  const loginUser = async (username: string, password: string) => {
    try {
      const userData: User = await login(username, password); // API volání
      user.value = userData; // Uložení do stavu
      localStorage.setItem('user', JSON.stringify(userData)); // Volitelně uložení do localStorage
    } catch (error) {
      console.error("Login failed:", error); // Logování chyby
      throw error;
    }
  };

  const restoreSession = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      user.value = JSON.parse(savedUser); // Obnovení uživatele
    }
  };

  const fetchAndSetUserData = async (userId: number) => {
    try {
      const userData = await fetchUserData(userId); // API volání
      user.value = userData; // Uložení do stavu
    } catch (error) {
      console.error("fetchAndSetUserData failed:", error); // Logování chyby
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout(); // API volání
      user.value = null;
      localStorage.removeItem('user');
    } catch (error) {
      console.error("logoutUser failed:", error); // Logování chyby
      throw error;
    }
  };

  return {
    user,
    isLoggedIn,
    loginUser,
    restoreSession,
    fetchAndSetUserData,
    logoutUser,
  };
});
