import { computed, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type Calculation,
  type CalculationAnswer,
  type CalculationLevel,
  EDevice,
  EGameProgress,
  EPlayerTurn,
  type GameCalculation, type User
} from '@/types/calculationTypes'
import { GameCalculationLearnService } from '@/services/GameCalculationLearnService'
import { useAuthStore } from '@/stores/auth'
import { DbCalculationCrudService } from '@/services/DbCalculationCrudService'
import { logger } from '@/services/Logger'
import type { GcTime } from '@/types/GcTime'
import { useStopwatch } from '@/composable/useStopwatch'
import type { PuzzleImageModel } from '@/types/puzzelTypes'
import { usePuzzleImage } from '@/composable/usePuzzle'

export const useGameStore = defineStore('game', () => {
  const game = ref<GameCalculation | null>(null);
  const isGameActive = computed(() => game.value !== null);
  const authStore = useAuthStore();
  const user = computed<User | undefined | null>(() => authStore.user);
  const turnTimeFirst = ref<GcTime>({seconds: 0, milliseconds: 0, millisecondsTotal: 0});
  const turnTimeTotal = ref<GcTime>({seconds: 0, milliseconds: 0, millisecondsTotal: 0});

  const stopWatchFirst = useStopwatch();
  const stopWatchTotal = useStopwatch();

  const usePuzzle = usePuzzleImage();
  const puzzleImageModel = ref(usePuzzle.puzzleImageModel);

  const dbLevels = new DbCalculationCrudService<CalculationLevel>('/levels.php'); //TODO move to service? split state with logic and DB logic?

  async function startGame(levelId: number) {
    const level = await loadLevel(levelId); //TODO cache

    if (user.value && level) {
      game.value = GameCalculationLearnService.createGame(level, user.value);
      game.value.gameState.playerOnTurn = EPlayerTurn.PLAYER;
      game.value.gameState.currentTurnIndexInGameScenario = 0;
      updateGameProgress();
    }
  }

  async function changeLevel(id: number){
    console.log('changeLog');
    await startGame(id);
  }

  function doSkipAnswer( playerOnTurn: EPlayerTurn) {
    doAnswer(undefined, playerOnTurn);
  }

  function doAnswer(answer: number|undefined, playerOnTurn: EPlayerTurn) {
    if (game.value && game.value.gameState.gameProgress === EGameProgress.RUNNING) {
      stopTurnTimerTotal();
      //TODO move to service?
      const currCalc = getCurrentCalculation();
      if (currCalc ) {
        const calcAnswer: CalculationAnswer = {
          answer: answer,
          answerTimeFirst: {...turnTimeFirst.value},
          answerTimeTotal: {...turnTimeTotal.value},
          calculation: currCalc,
          calculationIndexInGameScenario: 0,
          device: getDeviceType(),
          isCorrect: (currCalc.correctAnswer === answer)
        }
        if (playerOnTurn === EPlayerTurn.PLAYER) {
          game.value.player.answers?.push(calcAnswer);
        }
        else if (playerOnTurn === EPlayerTurn.OPPONENT && game.value.opponent) {
          game.value.opponent.answers?.push(calcAnswer);
        }
        nextQuestion();
      }
    updateGameProgress();
    }
  }

  function nextQuestion() {
    if (game.value){
      if (game.value && (game.value.gameState.currentTurnIndexInGameScenario) < game.value.gameScenario.length) {
          // increase index of the scenario
          console.log('nextQuestion')
          game.value.gameState.currentTurnIndexInGameScenario = game.value.gameState.currentTurnIndexInGameScenario + 1;
          startTurnTimer();
      }
    }
  }

  function updateGameProgress() {
    if (game.value){
      console.log(` UPdateGameProgress ${game.value.gameState.currentTurnIndexInGameScenario} vs. ${game.value.gameScenario.length}`)
      if (game.value.gameState.currentTurnIndexInGameScenario === 0) {
        console.log('STARTED')
        game.value.gameState.gameProgress = EGameProgress.STARTED;
      }
      if (game.value.gameState.currentTurnIndexInGameScenario < game.value.gameScenario.length) {
        console.log('RUNNING')
        game.value.gameState.gameProgress = EGameProgress.RUNNING;
        startTurnTimer();
      }
      else if (game.value.gameState.currentTurnIndexInGameScenario >= game.value.gameScenario.length - 1) {
        console.log('FINISHED')
        game.value.gameState.gameProgress = EGameProgress.FINISHED;
        game.value.gameState.currentTurnIndexInGameScenario = game.value.gameScenario.length - 1;
        stopTurnTimerFirst();
        stopTurnTimerTotal();
      }
    }
  }

  function isActivePlayer(): boolean {
    return game.value?.gameState.playerOnTurn === EPlayerTurn.PLAYER;
  }

  function getDeviceType(): EDevice {
    if (/Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)) {
      return EDevice.MOBILE;
    }
    return EDevice.DESKTOP;
  }

  function getCurrentCalculation(): Calculation | undefined {
    logger.trace('Getting current question, calculation from the scenario', '', game.value?.gameScenario);
    const scenarioIndex = game.value?.gameState.currentTurnIndexInGameScenario;
    if (scenarioIndex != undefined && game.value?.gameScenario != undefined && scenarioIndex < game.value?.gameScenario.length) {
      return game.value?.gameScenario[scenarioIndex];
    }
    else {
      logger.warn('Not enough items in gameScenario, index = ' + scenarioIndex + ', length:', '', game.value?.gameScenario.length);
    }
    return undefined;
  }

  async function loadLevel(levelId: number): Promise<CalculationLevel> {
    return await dbLevels.fetchItem(levelId);
  }

  function endGame() {
    game.value = null;
    updateGameProgress();
  }

  function pauseGame() {
    if (game.value) {
      if (game.value.gameState.gameProgress === EGameProgress.RUNNING) {
        game.value.gameState.gameProgress = EGameProgress.PAUSED;
        stopWatchFirst.pause();
        stopWatchTotal.pause();
      }
    }
  }

  function resumeGame() {
    if (game.value) {
      if (game.value.gameState.gameProgress === EGameProgress.PAUSED) {
        game.value.gameState.gameProgress = EGameProgress.RUNNING;
        stopWatchFirst.resume();
        stopWatchTotal.resume();
      }
    }
  }

  function resetGame() {
    stopWatchFirst.stop();
    stopWatchTotal.stop();

    if (game.value) {
      game.value.gameState.playerOnTurn = EPlayerTurn.PLAYER;
      game.value.gameState.currentTurnIndexInGameScenario = 0;
      game.value.player.answers = [];
      updateGameProgress();
    }

    stopWatchFirst.start();
    stopWatchTotal.start();
  }

  function leaveGame() {
    if (game.value) {
      game.value.gameState.gameProgress = EGameProgress.LEAVED_NOT_FINISHED;
    }
    stopWatchFirst.stop();
    stopWatchTotal.stop();
    game.value = null;
  }

  function startTurnTimer() {
    if (game.value && game.value.gameState.gameProgress === EGameProgress.RUNNING) {
      stopWatchFirst.stop();
      stopWatchTotal.stop();
      stopWatchFirst.start();
      stopWatchTotal.start();
      turnTimeFirst.value = stopWatchFirst.time.value;
      turnTimeTotal.value = stopWatchTotal.time.value;
    }
  }

  function stopTurnTimerFirst() {
    console.log('stopTurnTimerFirst');
    stopWatchFirst.stop();
    turnTimeFirst.value = stopWatchFirst.time.value;
  }

  function stopTurnTimerTotal() {
    console.log('stopTurnTimerTotal');
    stopWatchTotal.stop();
    turnTimeTotal.value = stopWatchTotal.time.value;
  }

  function continueAnswering() {
    if (game.value && game.value.gameState.gameProgress === EGameProgress.RUNNING) {
      console.log('continueAnswering');
      const newStartTime = stopWatchTotal.time.value.seconds * 1000 + stopWatchTotal.time.value.milliseconds;
      stopWatchFirst.stop();
      stopWatchTotal.stop();
      stopWatchFirst.newStart(newStartTime);
      stopWatchTotal.newStart(newStartTime);
    }
  }

  return {
    game,
    isGameActive,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    endGame,
    leaveGame,
    changeLevel,
    doAnswer,
    doSkipAnswer,
    isActivePlayer,
    getCurrentCalculation,
    continueAnswering,
    turnTimeFirst,
    stopTurnTimerFirst,
    turnTimeTotal,
    usePuzzle,
    puzzleImageModel,
  };
});
