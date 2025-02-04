import axios from 'axios';
import { ref } from 'vue'

export function useCalculationApi<T>(apiEndpoint: string) {
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const fetchDataById = async (id: number): Promise<T> => {
    try {
      const response = await axios.get<T>(`${API_BASE_URL}${apiEndpoint}?id=${id}`);
      return response.data; // Vrátí data uživatele
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
  };

  return {
    fetchDataById,
  };
}
