import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type Calculation,
  type CalculationAnswer,
  type CalculationLevel, type DoIncorrectAnswer, type DoTurnHistory,
  EDevice,
  EGameProgress,
  EPlayerTurn,
  type GameCalculation,
  type User
} from '@/types/calculationTypes'
import { GameCalculationLearnService } from '@/services/GameCalculationLearnService'
import { useAuthStore } from '@/stores/auth'
import { DbCalculationCrudService } from '@/services/DbCalculationCrudService'
import { logger } from '@/services/Logger'
import type { GcTime } from '@/types/GcTime'
import { useStopwatch } from '@/composable/useStopwatch'
import { usePuzzleImage } from '@/composable/usePuzzle'
import { useLevelStore } from '@/stores/useLevelStore'

export const useGameStore = defineStore('game', () => {
  const game = ref<GameCalculation | null>(null);
  const isGameActive = computed(() => game.value !== null);
  const authStore = useAuthStore();
  const levelStore = useLevelStore();
  const user = computed<User | undefined | null>(() => authStore.user);
  const turnTimeFirst = ref<GcTime>({seconds: 0, milliseconds: 0, millisecondsTotal: 0});
  const turnTimeTotal = ref<GcTime>({seconds: 0, milliseconds: 0, millisecondsTotal: 0});

  const stopWatchFirst = useStopwatch();
  const stopWatchTotal = useStopwatch();

  const usePuzzle = usePuzzleImage();
  const puzzleImageModel = ref(usePuzzle.puzzleImageModel);

  const dbLevels = new DbCalculationCrudService<CalculationLevel>('/levels.php'); //TODO move to service? split state with logic and DB logic?
  const dbIncorrectAnswers = new DbCalculationCrudService<DoIncorrectAnswer>('/incorrect_answers.php'); //TODO move to service? split state with logic and DB logic?
  const dbTurnHistory = new DbCalculationCrudService<DoTurnHistory>('/turn_history.php'); //TODO move to service? split state with logic and DB logic?

  async function startGame(levelId: number) {
    const level = levelStore.level ? levelStore.level : await loadLevel(levelId); //TODO rework it - no ID no parameter just take it from the levelStore - handle level by levelStore and keep it synced in the game store..

    if (level) {
      game.value = GameCalculationLearnService.createGame(level, user.value ?? undefined);
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

  async function saveAnswer(user: User, level: CalculationLevel, incorrectAnswer: CalculationAnswer) {
    // FIXME the order is critical !!!!
    const doTurnHistory: DoTurnHistory = {
      PlayerID: user.userID ?? 0,
      LevelID: level.LevelID ?? 0,
      OperandA: incorrectAnswer.calculation.operandA,
      Operator: incorrectAnswer.calculation.operator,
      OperandB: incorrectAnswer.calculation.operandB,
      CorrectAnswer: incorrectAnswer.calculation.correctAnswer,
      PlayerAnswer: incorrectAnswer.answer ?? null,
      IsCorrect: incorrectAnswer.isCorrect,
      AnswerTimeFirstMs: incorrectAnswer.answerTimeFirst.millisecondsTotal,
      AnswerTimeTotalMs: incorrectAnswer.answerTimeTotal.millisecondsTotal,
      Device: getDeviceType(),
    }
    console.log('Saving answer: ', doTurnHistory);
    const isSuccess = await dbTurnHistory.insertItem(doTurnHistory);
    console.log('Save answer isSuccess = ', isSuccess);
  }

  async function saveIncorrectAnswer(user: User, level: CalculationLevel, incorrectAnswer: CalculationAnswer) {
    // FIXME the order is critical !!!!
    const doIncorrectAnwser: DoIncorrectAnswer = {
      PlayerID: user.userID,
      OperandA: incorrectAnswer.calculation.operandA,
      Operator: incorrectAnswer.calculation.operator,
      OperandB: incorrectAnswer.calculation.operandB,
      CorrectAnswer: incorrectAnswer.calculation.correctAnswer,
      PlayerAnswer: incorrectAnswer.answer ?? null,
      AnswerTimeMs: incorrectAnswer.answerTimeFirst.millisecondsTotal,
      LevelID: level.LevelID ?? 0,
      Device: getDeviceType(),
    }
    console.log('Saving incorrect answer: ', doIncorrectAnwser);
    const isSuccess = await dbIncorrectAnswers.insertItem(doIncorrectAnwser);
    console.log('Save incorrect answer isSuccess = ', isSuccess);
  }

  async function doAnswer(answer: number|undefined, playerOnTurn: EPlayerTurn) {
    logger.info('do answer = ' + answer);
    if (game.value && game.value.gameState.gameProgress === EGameProgress.RUNNING) {
      stopTurnTimerTotal();
      //TODO move to service?
      const currCalc = getCurrentCalculation();
      if (currCalc) {
        const calcAnswer: CalculationAnswer = {
          answer: answer,
          answerTimeFirst: {...turnTimeFirst.value},
          answerTimeTotal: {...turnTimeTotal.value},
          calculation: currCalc,
          calculationIndexInGameScenario: 0,
          device: getDeviceType(),
          isCorrect: (currCalc.correctAnswer === answer)
        }
        
        if (user.value && game.value.level) {
          await saveAnswer(user.value, game.value.level, calcAnswer)
        }
        if (playerOnTurn === EPlayerTurn.PLAYER) {
          game.value.player.answers?.push(calcAnswer);
          if (!calcAnswer.isCorrect && user.value && game.value.level && user.value.userID) {
            // store it to incorrect answers
            await saveIncorrectAnswer(user.value, game.value.level, calcAnswer);
          }
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

  function resetGameTimer() {
    stopWatchFirst.stopAndClear();
    stopWatchTotal.stopAndClear();

    stopWatchFirst.start();
    stopWatchTotal.start();
  }

  function resetGame() {
    if (game.value) {
      game.value.gameState.playerOnTurn = EPlayerTurn.PLAYER;
      game.value.gameState.currentTurnIndexInGameScenario = 0;
      game.value.player.answers = [];
      updateGameProgress();
    }
    resetGameTimer();
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

  function getWrongAnswers(): CalculationAnswer[] {
    if (game.value && game.value.player && game.value.player.answers) {
      return game.value.player.answers.filter(answer => answer.isCorrect == false);
    }
    return [];
  }

  return {
    game,
    isGameActive,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    resetGameTimer,
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
    getWrongAnswers,
  };
});
