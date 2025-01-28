// src/composables/useUserApi.ts
import axios from 'axios';

export function useUserApi() {
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(API_BASE_URL + '/login.php', { username, password });
      if (response?.data?.message === 'Login successful'){
        return response.data.player;
      }
      else {
        throw new Error('Login failed.. server problem');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const fetchUserData = async (userId: number) => {
    try {
      const response = await axios.get(`API_BASE_URL/players.php'?id=${userId}`);
      return response.data; // Vrátí data uživatele
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
  };

  const logout = async () => {
    // try {
    //   await axios.post('/api/logout');
    // } catch (error: any) {
    //   throw new Error(error.response?.data?.message || 'Logout failed');
    // }
    console.log('TODO php server side Logout');
  };

  return {
    login,
    fetchUserData,
    logout,
  };
}
