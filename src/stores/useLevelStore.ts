import { defineStore } from 'pinia';
import { ref } from 'vue';
import Cookies from 'js-cookie';
import type { CalculationLevel } from '@/types/calculationTypes'

export const useLevelStore = defineStore('level', () => {
  const level = ref<CalculationLevel | null>(null);

  function loadLevel() {
    const savedLevel = Cookies.get('calculationLevel');
    if (savedLevel) {
      level.value = JSON.parse(savedLevel);
    }
  }

  function setLevel(newLevel: CalculationLevel | null) {
    level.value = newLevel;
    Cookies.set('calculationLevel', JSON.stringify(newLevel), { expires: 30 });
  }

  loadLevel();

  return { level, setLevel };
});
