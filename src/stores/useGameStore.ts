import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type CalculationAnswer,
  type CalculationLevel,
  EDevice,
  EPlayerTurn,
  type GameCalculation
} from '@/types/calculationTypes'
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

  async function answer(answer: number|undefined, indexFromScenario: number, answerTimeFirstMs: number, answerTimeTotalMs: number, playerOnTurn: EPlayerTurn) {
    if (game.value) {
      const calcAnswer: CalculationAnswer = {
        answer: answer,
        answerTimeFirstMs: answerTimeFirstMs,
        answerTimeTotalMs: answerTimeTotalMs,
        calculation: game.value.gameScenario[indexFromScenario],
        calculationIndexInGameScenario: 0,
        device: getDeviceType(),
        isCorrect: (game.value.gameScenario[indexFromScenario].correctAnswer === answer)
      }
      if (playerOnTurn === EPlayerTurn.PLAYER) {
        game.value.player.answers?.push(calcAnswer);
      }
      else if (playerOnTurn === EPlayerTurn.OPPONENT && game.value.opponent) {
        game.value.opponent.answers?.push(calcAnswer);
      }
    }
  }

  function getDeviceType(): EDevice {
    if (/Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)) {
      return EDevice.MOBILE;
    }
    return EDevice.DESKTOP;
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
    answer,
  };
});
