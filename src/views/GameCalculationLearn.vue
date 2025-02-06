<template>
<div @click="removeButtonFocus">
  <v-form>
    <v-btn small @click="(event: MouseEvent) => { startGame(); (event.target as HTMLElement).blur(); }" @keydown.prevent>Start/Pause Game</v-btn>
    <v-btn small @click="stopGame" @keydown.prevent>Stop Game</v-btn>
<!--    Reset Game-->
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
                <GcPuzzle/>
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
    <!--      <v-card>-->
    <!--        Level: <pre style="font-size: 9px">{{ initLevel }}</pre>-->
    <!--      </v-card>-->
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
import { type Calculation, EPlayerTurn, type GameCalculation } from '@/types/calculationTypes'
import AnswersList from '@/components/AnswersList.vue'
import GcPlayerInfo from '@/components/game_components/GcPlayerInfo.vue'
import GcPuzzle from '@/components/game_components/GcPuzzle.vue'
import GcCalculationQuestion from '@/components/game_components/calculation/GcCalculationQuestion.vue'
import Numpad from '@/components/Numpad.vue'
import { useStopwatch } from '@/composable/useStopwatch'
import TimeWatchSpan from '@/components/TimeWatchSpan.vue'
import type { GcTime } from '@/types/GcTime'
import { useStopwatchGlobalStore } from '@/stores/useStopwatchGlobalStore'

const gameStore = useGameStore();
const game = computed<GameCalculation | null>(() => gameStore.game);

const stopWatch = useStopwatchGlobalStore();
const time = computed<GcTime>(() => stopWatch.time);

//MODEL:::
const userAnswer = ref<number|undefined>();
const timeLeft = computed<number | undefined>(() => game.value?.gameState.remainingTime);
const message = ref('Todo Msg - odpověď byla... špatně/sprvně ..něco motivačního')
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


function stopGame() {
  gameStore.endGame();
}

function doAnswer() {
  gameStore.doAnswer(userAnswer.value, EPlayerTurn.PLAYER);
  userAnswer.value = undefined;
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
