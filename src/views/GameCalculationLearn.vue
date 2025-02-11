<template>

<LevelDialog ref="dialogRef" />

<div @click="removeButtonFocus">
  <GameLearingTestingMenu
    v-if="isDebugMode"
    :removeButtonFocus="removeButtonFocus"
    :startGame="startGame"
    :stopGame="stopGame"
    :doResetGame="doResetGame"
    :changeLevel="changeLevel"
    :doAnswer="doAnswer"
    :doSkipAnswer="doSkipAnswer"
    :startMs="stopWatch.start"
    :stopMs="stopWatch.stop"
    :startAnswering="startAnswering"
    :gameStore="gameStore"
    :stopWatch="stopWatch"
    :game="game"
  />

    <v-row no-gutters>
      <!-- Playboard container -->
      <v-col cols="8" class="playboard-container">
        <div class="playboard" >
          <h4 style="text-align: center; font-weight: bold">Procvičování počítání</h4>
          <p style="font-size: small; text-align: center">{{ levelMessage }}</p>

          <div style="margin-top: 10px">
            <v-row no-gutters>
              <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-start" style="flex-grow: 1">
                <GcPlayerInfo/>
              </v-col>
              <v-col class="d-flex justify-start" style="flex-grow: 1">
                <GcPuzzle
                  :puzzle-image-model=gameStore.usePuzzle.puzzleImageModel
                  :param_max-height="400"
                  :param_max-width="400"/>
              </v-col>
            </v-row>

            <div style="display: flex; flex-grow: 1">
              <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
              <div style="display: flex; flex-grow: 1; font-size: small">
                <div style="font-weight: bold; text-align: left; margin: 10px 0 0 0">{{ message }}</div>
              </div>
              <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
              <div style="text-align: right; display: flex; flex-grow: 0; margin: 0 5px; ">
                <div id="timer"><h6>Čas: <TimeWatchSpan :time="gameStore.turnTimeFirst"/></h6></div>
              </div>
            </div>

            <p id="question" style="font-weight: bold; text-align: left; margin: 8px 0 8px 10%"><GcCalculationQuestion
              :current-question="gameStore.getCurrentCalculation()"
              :current-turn-index-in-game-scenario="game?.gameState.currentTurnIndexInGameScenario"
              :user-answer="userAnswer"
            /></p>
            <div class="pa-1 ma-1">
              <Numpad v-model:userAnswer="userAnswer"  @start-answering="startAnswering()" @continue-answering="continueAnswering()" />
            </div>

            <div style="margin-top: 20px; padding: 10px;">
              <v-row v-if="gameStore.game !== null" >
                <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-start w-100">
                  <v-btn class="w-100 answer-button" @click="doAnswer()" :disabled="!isAnswerAllowed()" color="green">Odpovědět</v-btn>
                </v-col>
                <v-col class="d-flex justify-start w-100">
                  <v-btn class="w-100 answer-button" @click="doSkipAnswer()" :disabled="!isSkipAnswerAllowed()" color="#FFD099FF">Nevím ?</v-btn>
                </v-col>
              </v-row>
              <v-row v-else >
                <v-col><v-btn class="w-100" @click="startGame()" :disabled="isPaused" color="green">START</v-btn></v-col>
              </v-row>
              <v-row style="margin-top: 30px">
                <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-center w-100">
                  <v-btn v-if="gameStore.game !== null" class="w-100" @click="togglePause()" >
                    <span style="width: 100px">{{ isPaused ? '> Pokračovat' : '|| Pauza' }}</span>
                  </v-btn>
                </v-col>

                <!-- Tlačítko zarovnané vpravo, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-end w-100">
                  <v-btn v-if="
                    gameStore.game !== null
                    && game?.gameState.gameProgress === EGameProgress.RUNNING || game?.gameState.gameProgress === EGameProgress.PAUSED
                  " class="w-100" @click="doResetGame" color="#333333">Reset</v-btn>
                  <v-btn v-else-if="gameStore.game !== null" class="w-100" @click="startGame()"  color="#333333">START</v-btn>
                </v-col>
              </v-row>
              <br>
              <hr/>
              <br>
              <v-row v-if="
                (gameStore.game?.gameScenario?.length ?? 0) > 0
                && game?.gameState.gameProgress != null
                ">
                <v-col><v-btn  class="w-100" @click="openLevelDialog()" >LEVEL ?</v-btn></v-col>
                <v-col><v-btn  class="w-100" @click="shuffleScenario()" color="#ABF3FFFF">Mix</v-btn></v-col>
                <v-col><v-btn  class="w-100" @click="maxCalculations()" color="#FFFFAFFF">Max příkladů ?</v-btn></v-col>
                <v-col><v-text-field density="compact" style="width: 80px" v-model="maxCalculationsNumber" label="" type="number" min="1" step="1"/></v-col>
              </v-row>
            </div>

          </div>
        </div>
      </v-col>

      <!-- History container -->
      <v-col cols="4" class="history-container">
        <div class="history">
          <h4 style="text-align: center">Historie tahů: {{ game?.player?.answers?.length }}</h4>
          <v-card>
            <AnswersList :answers="game?.player?.answers || []"/>
          </v-card>
        </div>
        <!--        <AnimeSprite :show-source-link="false" :transform-scale="0.5" :transform-origin="`bottom center`"/>-->
      </v-col>
    </v-row>

  <v-row>
    <v-col>
      <v-card style="width: fit-content;">
        <CalculationList :calculations="game?.gameScenario || []" />
      </v-card>
    </v-col>
    <v-col>
      <v-card style="width: fit-content;">
        <AnswersList :answers="game?.player?.answers || []" :is-time-visible-first="true" :is-time-visible-total="true" />
      </v-card>
    </v-col>
  </v-row>

  <v-container v-if="isLoggedIn && loggedUser?.username === 'admin'">
    <v-card>
      Game: <pre style="font-size: 9px">{{ game }}</pre>
    </v-card>
  </v-container>
</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import CalculationList from '@/components/CalculationList.vue'
import { EGameProgress, EPlayerTurn, type GameCalculation } from '@/types/calculationTypes'
import AnswersList from '@/components/AnswersList.vue'
import GcPlayerInfo from '@/components/game_components/GcPlayerInfo.vue'
import GcCalculationQuestion from '@/components/game_components/calculation/GcCalculationQuestion.vue'
import Numpad from '@/components/Numpad.vue'
import TimeWatchSpan from '@/components/TimeWatchSpan.vue'
import { useStopwatchGlobalStore } from '@/stores/useStopwatchGlobalStore'
import GcPuzzle from '@/components/game_components/puzzle/GcPuzzle.vue'
import { ImageUtils } from '@/utils/ImageUtils'
import GameLearingTestingMenu from '@/components/game_components/GameLearingTestingMenu.vue'
import { GameCalculationLearnService } from '@/services/GameCalculationLearnService'
import LevelDialog from '@/components/game_components/LevelDialog.vue'
import { useLevelStore } from '@/stores/useLevelStore'
import { useAuthStore } from '@/stores/auth'

const isDebugMode = computed(() => localStorage.getItem("debugMode") === "true");

// AUTH:
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn); // Dynamický stav
const loggedUser = computed(() => authStore.user); // Dynamický stav


const gameStore = useGameStore();
const game = computed<GameCalculation | null>(() => gameStore.game);
const maxCalculationsNumber = ref<number>(10);

const stopWatch = useStopwatchGlobalStore();

//MODEL:::
const userAnswer = ref<number|undefined>();
const timeLeft = computed<number | undefined>(() => game.value?.gameState.remainingTime);
const message = computed<string>(() => getMessage());
const levelMessage = computed<string>(() => getLevelMessage());
const isPaused = ref<boolean>(false);

//puzzle:
// const usePuzzle = usePuzzleImage();
// const puzzleImageModel = usePuzzle.puzzleImageModel;
const imageUrl = "https://kosmonautix.cz/wp-content/uploads/2022/03/1094599-1024x640.jpg";
let heightPx = 0;
let widthPx = 0;
ImageUtils.getImageDimensions(imageUrl)
  .then(dimensions => {
    heightPx = dimensions.height;
    widthPx = dimensions.width;
    console.log(`Šířka: ${dimensions.width}px, Výška: ${dimensions.height}px`);
  })
  .catch(error => {
    console.log(error);
  });

function getMessage(): string {
  if (!game.value) {
    return 'Stiskni Start a začni hrát'
  }
  let msgGameState = '';
  const gameProgess = game?.value.gameState.gameProgress;
  if (gameProgess === EGameProgress.RUNNING) {
    msgGameState = 'Hraješ';
  } else if (gameProgess === EGameProgress.PAUSED) {
    msgGameState = 'Pauza... '
  } else if (gameProgess === EGameProgress.FINISHED) {
    msgGameState = 'KONEC';
  }
  return msgGameState;
}
function getLevelMessage(): string {
  let msgLevel = '';
  if (level.value) {
    msgLevel = 'Level: ' + (level.value ? level.value.Name : 'ID=' + game?.value?.level.LevelID);
  }

  return msgLevel;
}

function preparePuzzle() {
  gameStore.usePuzzle.createPuzzle(imageUrl, widthPx, heightPx, gameStore.game?.gameScenario.length ?? 0);
  console.log('preparing puzzle: ', gameStore.usePuzzle.puzzleImageModel);
}

// Level Dialog:
const dialogRef = ref<InstanceType<typeof LevelDialog> | null>(null);
const store = useLevelStore();
const level = computed(() => store.level);
// ------------------------

onMounted(async () => {
  // console.log('leaded level:', initLevel.value);
});

async function changeLevel(): Promise<string | null>{
  console.log('changeLog');
  const id = prompt("Enter the LevelID to change:");
  if (!id) return null;
  await gameStore.changeLevel(Number(id));
  preparePuzzle();
  return id;
}

async function startGame() {
  await gameStore.startGame(gameStore.game?.level.LevelID ?? 1);//TODO level ID  hard coded
  preparePuzzle();
  maxCalculationsNumber.value = game.value?.gameScenario.length ?? 0;
  resetTimerAndPause();
}

function togglePause() {
  if (!isPaused.value) {
    gameStore.pauseGame();
  }
  else {
    gameStore.resumeGame();
  }
  isPaused.value = !isPaused.value;
}

function doResetGame() {
  gameStore.resetGame();
  if(game.value && game.value.gameScenario?.length > 0) {
    game.value.gameScenario = GameCalculationLearnService.generateScenario(game.value.level, false);
  }
  isPaused.value = false;
  preparePuzzle();
}

function shuffleScenario() {
  if(game.value && game.value.gameScenario?.length > 0) {
    game.value.gameScenario = GameCalculationLearnService.shuffle(game.value.gameScenario)
  }
  gameStore.resetGame();
  isPaused.value = false;
  preparePuzzle();
  resetTimerAndPause();
}

async function maxCalculations() {
  console.log('max calculations');
  const count = maxCalculationsNumber.value;
  if (!count) return null;
  if(game.value && game.value.gameScenario?.length > 0) {
    const previousScenarioLength = game.value.gameScenario?.length ?? 0;
    const alreadyAnswered = game.value?.player?.answers?.length ?? 0;
    const backupPuzzleModel = gameStore.usePuzzle.puzzleImageModel;
    game.value.gameScenario = GameCalculationLearnService.generateScenario(game.value.level, false).slice(0, count);
    if (count > alreadyAnswered && count < previousScenarioLength && backupPuzzleModel?.revealedState) {
      preparePuzzle();
      gameStore.usePuzzle.revealCount(backupPuzzleModel?.revealedState.revealedPiecesCount);
    }
    else {
      gameStore.resetGame();
      preparePuzzle();
    }
    isPaused.value = false;
  }
  resetTimerAndPause();
}

function resetTimerAndPause() {
  gameStore.resetGameTimer();
  gameStore.pauseGame();
  isPaused.value = true;
}

async function selectLevel() {
  const id = await changeLevel();
  console.log('selected level id: ', id);
  if (id != null) {
    doResetGame();
  }
  resetTimerAndPause();
}

watch(level, (newLevel) => {
  if (game.value && newLevel) {
    game.value.level = newLevel
    doResetGame();
    resetTimerAndPause();
  }
  else if (!newLevel) {
    selectLevel();
    if (dialogRef.value) {
      dialogRef.value.isOpen = false; // ✅ Otevře dialog
    }
  }
});

function openLevelDialog() {
  if (dialogRef.value) {
    dialogRef.value.isOpen = true; // ✅ Otevře dialog
  }
}

function stopGame() {
  gameStore.endGame();
}

function isAnswerAllowed(): boolean {
  if (!game?.value) {
    return false;
  }
  const gameIsPaused = isPaused.value;
  const gameFinished = game?.value.gameState.gameProgress === EGameProgress.FINISHED;
  const answerFilled = userAnswer.value !== undefined;

  return !gameIsPaused && !gameFinished && answerFilled;
}

function isSkipAnswerAllowed(): boolean {
  if (!game?.value) {
    return false;
  }
  const gameIsPaused = isPaused.value;
  const gameFinished = game?.value.gameState.gameProgress === EGameProgress.FINISHED;

  return !gameIsPaused && !gameFinished;
}

async function doAnswer() {
  await gameStore.doAnswer(userAnswer.value, EPlayerTurn.PLAYER);
  userAnswer.value = undefined;
  if (gameStore.getCurrentCalculation()?.correctAnswer === userAnswer.value) {
    //TODO - puzzle ? reveal only for success answers?
  }
  gameStore.usePuzzle.revealNext();
}
function doSkipAnswer() {
  gameStore.doSkipAnswer(EPlayerTurn.PLAYER);
  userAnswer.value = undefined;
  gameStore.usePuzzle.revealNext();
}

function startAnswering() {
  if (isPaused.value) {
    togglePause();
  }
  else {
    console.log('start answering');
    gameStore.stopTurnTimerFirst();
  }
}

function continueAnswering() {
  console.log('continue answering');
  gameStore.continueAnswering();
}

// Přidání event listeneru
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

// Odebrání event listeneru při unmountu
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    console.trace('ENTEEEEEEEEEEEEEEEEEEEEER')
    doAnswer()
  }
  if (event.key === 'Pause') {
    togglePause()
  }
  const num = parseInt(event.key, 10);
  if (isPaused.value && !isNaN(num) && num >= 0 && num <= 9) {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
      console.trace('ignoring key event for input or textarea');
      return;
    }
    togglePause();
  }
  return {
    doAnswer
  }

}

const removeButtonFocus = () => {
  document.querySelectorAll('button').forEach((btn) => btn.blur());
};

</script>

<style scoped>
#question {
  margin: 20px 0;
  font-size: 20px;
}
#timer {
  color: red;
  text-align: right;
  font-size: 20px;
    margin-top: 10px;
}

/* Playboard má vyplňovat celý levý prostor */
.playboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playboard {
  background-color: #f5f5f5; /* Pozadí herní desky */
  padding: 5px;
  height: 100%; /* Zajistí vyplnění výšky rodičovského kontejneru */
}

.answer-button {
    height: 70px;
}

</style>
