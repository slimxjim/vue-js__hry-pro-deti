<template>
<div @click="removeButtonFocus">
  <v-form>
    <v-btn small @click="(event: MouseEvent) => { startGame(); (event.target as HTMLElement).blur(); }" @keydown.prevent>Start/Pause Game</v-btn>
    <v-btn small @click="stopGame" @keydown.prevent>Stop Game</v-btn>
    <v-btn small color="gray" @click="doResetGame" @keydown.prevent>Reset</v-btn>
    <v-btn small color="gray" @click="changeLevel" @keydown.prevent>Change level</v-btn>
    <v-btn small color="gray" @click="doAnswer" @keydown.prevent>answer</v-btn>
    <v-btn small color="gray" @click="doSkipAnswer" @keydown.prevent>nevím</v-btn>
    |
    <v-btn small color="gray" @click="stopWatch.start()" @keydown.prevent>Start ms</v-btn>
    <v-btn small color="gray" @click="stopWatch.stop()" @keydown.prevent>Stop ms</v-btn>
    <v-btn small color="gray" @click="startAnswering" @keydown.prevent>Answering</v-btn>
  </v-form>
  <div v-if="gameStore.isGameActive">
    <v-row>
      <v-col>Game in progress...{{ game?.gameState.gameProgress }} -> {{ game?.gameState.currentTurnIndexInGameScenario }} </v-col>
      <v-col>Time = <TimeWatchSpan :time="gameStore.turnTimeFirst"/></v-col><v-col><TimeWatchSpan :time="gameStore.turnTimeTotal"/></v-col>
    </v-row>
  </div>

  <v-container title="The Game Calc - Learn">

    <v-row no-gutters>
      <!-- Playboard container -->
      <v-col cols="8" class="playboard-container">
        <div class="playboard" >
          <h2 style="text-align: center; font-weight: bold">Procvičování počítání</h2>

          <div style="margin-top: 10px">
            <v-row no-gutters>
              <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-start w-100">
                <GcPlayerInfo/>
              </v-col>
              <v-col class="d-flex justify-start w-100">
<!--                <GcPuzzle-->
<!--                  :puzzle-image-model="gameStore.usePuzzleImage.puzzleImageModel"-->
<!--                  :param_max-width="250"-->
<!--                  :param_max-height="250"-->
<!--                />-->
              </v-col>
            </v-row>

            <div style="display: flex; flex-grow: 1">
              <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
              <div style="display: flex; flex-grow: 1">
                <GcCalculationQuestion
                  :current-question="gameStore.getCurrentCalculation()"
                  :current-turn-index-in-game-scenario="game?.gameState.currentTurnIndexInGameScenario"
                  :user-answer="userAnswer"
                />
              </div>
              <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
              <div style="text-align: right; display: flex; flex-grow: 0; margin: 0 5px">
                <div id="timer">Čas: {{ timeLeft }}</div>
              </div>
            </div>

            <p style="font-weight: bold; text-align: center; margin: 10px 0">{{ message }}</p>

            <div class="pa-1 ma-1">
              <Numpad v-model:userAnswer="userAnswer"  @start-answering="startAnswering()" @continue-answering="continueAnswering()" />
            </div>

            <div style="margin-top: 20px; padding: 10px;">
              <v-row>
                <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-start w-100">
                  <v-btn class="w-100" @click="doAnswer" :disabled="isPaused" color="green">Odpovědět</v-btn>
                </v-col>
              </v-row>
              <v-row style="margin-top: 30px">
                <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-center w-100">
                  <v-btn class="w-100" @click="togglePause()" >
                    <span style="width: 100px">{{ isPaused ? 'Pokračovat' : 'Pauza' }}</span>
                  </v-btn>
                </v-col>

                <!-- Tlačítko zarovnané vpravo, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-end w-100">
                  <v-btn class="w-100" @click="doResetGame" color="#333333">Reset</v-btn>
                </v-col>
              </v-row>
            </div>

          </div>
        </div>
      </v-col>
    </v-row>

  </v-container>

  <v-row>
    <v-col>
      <v-card style="width: fit-content;">
        <CalculationList :calculations="game?.gameScenario || []" />
      </v-card>
    </v-col>
    <v-col>
      <v-card style="width: fit-content;">
        <AnswersList :answers="game?.player?.answers || []" />
      </v-card>
    </v-col>
  </v-row>

  <v-container>
    <v-card>
      Game: <pre style="font-size: 9px">{{ game }}</pre>
    </v-card>
  </v-container>
</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import CalculationList from '@/components/CalculationList.vue'
import { EPlayerTurn, type GameCalculation } from '@/types/calculationTypes'
import AnswersList from '@/components/AnswersList.vue'
import GcPlayerInfo from '@/components/game_components/GcPlayerInfo.vue'
import GcCalculationQuestion from '@/components/game_components/calculation/GcCalculationQuestion.vue'
import Numpad from '@/components/Numpad.vue'
import TimeWatchSpan from '@/components/TimeWatchSpan.vue'
import type { GcTime } from '@/types/GcTime'
import { useStopwatchGlobalStore } from '@/stores/useStopwatchGlobalStore'

const gameStore = useGameStore();
const game = computed<GameCalculation | null>(() => gameStore.game);

// const puzzleImageModelRef = computed<PuzzleImageModel | undefined | null>(() => gameStore.usePuzzleImage.puzzleImageModel);

const stopWatch = useStopwatchGlobalStore();

//MODEL:::
const userAnswer = ref<number|undefined>();
const timeLeft = computed<number | undefined>(() => game.value?.gameState.remainingTime);
const message = ref('Todo Msg - odpověď byla... špatně/sprvně ..něco motivačního');
const isPaused = ref<boolean>(false);

// ------------------------

onMounted(async () => {
  // console.log('leaded level:', initLevel.value);
});

async function changeLevel(){
  console.log('changeLog');
  const id = prompt("Enter the LevelID to change:");
  if (!id) return;
  await gameStore.changeLevel(Number(id));
}

function startGame() {
  gameStore.startGame(1);
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
  isPaused.value = false;
}


function stopGame() {
  gameStore.endGame();
}

function doAnswer() {
  gameStore.doAnswer(userAnswer.value, EPlayerTurn.PLAYER);
  userAnswer.value = undefined;
  if (gameStore.getCurrentCalculation()?.correctAnswer === userAnswer.value) {
    // TODO reveal puzzle
  }
}
function doSkipAnswer() {
  gameStore.doSkipAnswer(EPlayerTurn.PLAYER);
  userAnswer.value = undefined;
}

function startAnswering() {
  console.log('start answering');
  gameStore.stopTurnTimerFirst();
}

function continueAnswering() {
  console.log('continue answering');
  gameStore.continueAnswering();
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    doAnswer();
  }
  if (event.key === 'Pause') {
    togglePause();
  }
});

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
  margin: 20px 0;
  text-align: right;
  font-size: 20px;
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

</style>
