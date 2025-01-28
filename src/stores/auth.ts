// src/stores/auth.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue'
import { useUserApi } from '@/composable/useUserApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null); // Uchování uživatele
  const isLoggedIn = computed(() => user.value !== null);

  const { login, fetchUserData, logout } = useUserApi();

  const loginUser = async (email: string, password: string) => {
    try {
      const userData = await login(email, password); // API volání
      user.value = userData; // Uložení do stavu
      localStorage.setItem('user', JSON.stringify(userData)); // Volitelně uložení do localStorage
    } catch (error) {
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
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout(); // API volání
      user.value = null;
      localStorage.removeItem('user');
    } catch (error) {
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
