// src/stores/auth.ts
import { defineStore } from 'pinia';
import type { CalculationLevel, User } from '@/components/types/calculationTypes'
import { useCalculationApi } from '@/composable/useCalculationApi'
import { ref } from 'vue'

export const useLevelStore = defineStore('levels', () => {
  const level = ref<CalculationLevel | undefined | null>(null);

  const { fetchDataById } = useCalculationApi<CalculationLevel>('/levels.php');

  const getLevel = async (id: number) => {
    try {
      const fetchedData:  CalculationLevel = await fetchDataById(id);// API volání
      console.log('fetched level: ', fetchedData);
      level.value = fetchedData; // Uložení do stavu
      localStorage.setItem(`level(${id})`, JSON.stringify(fetchedData)); // Volitelně uložení do localStorage
    } catch (error) {
      console.error('Fetch data: ' + id, error); // Logování chyby
      throw error;
    }
  };


  return {
    level,
    getLevel,
  };
});
