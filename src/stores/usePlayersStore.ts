import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import type { User } from '@/components/types/calculationTypes'

export const usePlayersStore = defineStore("players", () => {
  const players = ref<User[]>([]);
  const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL;

  // Načtení všech hráčů
  async function fetchUsers() {
    try {
      const response = await axios.get<User[]>(`${apiBaseUrl}/players.php`);
      players.value = response.data;
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  }

  // Přidání nového hráče
  async function addUser(player: Omit<User, "playerID">) {
    try {
      const response = await axios.post<User>(`${apiBaseUrl}/players.php`, player);
      players.value.push(response.data);
    } catch (error) {
      console.error("Error adding player:", error);
    }
  }

  // Aktualizace hráče
  async function updateUser(updatedUser: User) {
    if (!updatedUser.userID) return;
    try {
      await axios.put(`${apiBaseUrl}/players.php/?id=${updatedUser.userID}`, updatedUser);
      const index = players.value.findIndex(p => p.userID === updatedUser.userID);
      if (index !== -1) players.value[index] = updatedUser;
    } catch (error) {
      console.error("Error updating player:", error);
    }
  }

  // Smazání hráče
  async function deleteUser(playerID: number) {
    try {
      await axios.delete(`${apiBaseUrl}/players.php/?id=${playerID}`);
      players.value = players.value.filter(p => p.userID !== playerID);
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  }

  return { players, fetchUsers, addUser, updateUser, deleteUser };
});
