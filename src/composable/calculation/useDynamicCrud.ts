import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

/**
 * Dynamická factory funkce pro vytvoření Pinia Store a odpovídajícího composable
 * @param storeName Název store (např. "players")
 * @param apiEndpoint API endpoint (např. "/players.php")
 * @param primaryKey Název primárního klíče v objektech (např. "playerID")
 */
export function createStoreAndComposable<T extends Record<string, any>>(
  storeName: string,
  apiEndpoint: string,
  primaryKey: keyof T
) {
  const useDynamicStore = defineStore(storeName, () => {
    const items = ref<T[]>([]);
    const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL;

    // Načtení všech záznamů
    async function fetchItems() {
      try {
        const response = await axios.get<T[]>(`${apiBaseUrl}${apiEndpoint}`);
        items.value = response.data;
      } catch (error) {
        console.error(`Error fetching ${storeName}:`, error);
      }
    }

    async function fetchItem(itemId: number): Promise<T> {
      try {
        const response = await axios.get(`${apiBaseUrl}${apiEndpoint}?id=${itemId}`);
        return response.data; // Vrátí data uživatele
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user data');
      }
    }

    return { items, fetchItems, fetchItem };
  });

  // Composable pro přístup k danému store
  function useDynamicComposable() {
    const store = useDynamicStore();
    return store;
  }

  return { useStore: useDynamicStore, useComposable: useDynamicComposable };
}
