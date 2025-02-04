import { computed, ref, unref } from 'vue'
import { defineStore } from 'pinia'
import type { CalculationLevel, GameCalculation, User } from '@/types/calculationTypes'
import { GameCalculationLearnService } from '@/services/GameCalculationLearnService'
import { useAuthStore } from '@/stores/auth'
import { DbCalculationCrudService } from '@/services/DbCalculationCrudService'

export const useGameStore = defineStore('game', () => {
  const game = ref<GameCalculation | null>(null);
  const isGameActive = computed(() => game.value !== null);
  const authStore = useAuthStore();
  const user = computed(() => authStore.user);

  const dbLevels = new DbCalculationCrudService<CalculationLevel>('/levels.php');


  async function startGame(levelId: number) {
    const level = await loadLevel(levelId);
    console.log('startGame > ', level);
    if (user.value && level) {
      game.value = GameCalculationLearnService.createGame(level, user.value);
    }
  }

  function updateGameState(newState: Partial<GameCalculation>) {
    if (game.value) {
      Object.assign(game.value, newState);
    }
  }

  async function changeLevel(id: number){
    console.log('changeLog');
    await startGame(id);
  }

  async function loadLevel(levelId: number): Promise<CalculationLevel> {
    return await dbLevels.fetchItem(levelId);
  }

  function endGame() {
    game.value = null;
  }

  return {
    game,
    isGameActive,
    startGame,
    updateGameState,
    endGame,
    changeLevel,
  };
});
