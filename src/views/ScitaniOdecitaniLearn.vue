<template>
  <div @keydown.enter.prevent="triggerButton">

    <div class="info-panel">
  <!--    <h1>Počítací střílečka</h1>-->
      <div class="players-panel">

      </div>
      <div class="history-panel">

      </div>
    </div>
    <div class="control-panel">

    </div>
    <div>
      <v-row no-gutters>
        <!-- Playboard container -->
        <v-col cols="8" class="playboard-container">
          <div class="playboard" >
            <h2 style="text-align: center; font-weight: bold">Počítací střílečka</h2>

            <div style="margin-top: 10px">
              <v-row no-gutters>
                <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-start w-100">
                  <v-card :class="[isActivePlayerClass('Tom'), 'card-player']">
                    <div class="player">
                      <h2>
                        <PlayerView/>
                      </h2>
                    </div>
                  </v-card>
                </v-col>
                <v-col class="d-flex justify-start w-100">
                  <v-card>
                    <PuzzleImage
                      ref="puzzleRef"
                      :param_numberOfHiddenPieces="listToLearn.length"
                      param_imagesUrl="https://kosmonautix.cz/wp-content/uploads/2022/03/1094599-1024x640.jpg"
                      :param_maxHeight="250"
                      :param_maxWidth="250"
                    />
                  </v-card>
                </v-col>
              </v-row>
              <div style="display: flex; flex-grow: 1">
                <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
                <div style="display: flex; flex-grow: 1">
                  <div id="question">{{ question }} = {{ userAnswer ?? '?'}}</div>
                </div>
                <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
                <div style="text-align: right; display: flex; flex-grow: 0; margin: 0 5px">
                  <div id="timer">Čas: {{ timeLeft }}</div>
                </div>
              </div>
            </div>

            <p style="font-weight: bold; text-align: center; margin: 10px 0">{{ message }}</p>

            <div class="pa-1 ma-1">
              <Numpad v-model:userAnswer="userAnswer" />
            </div>

            <div style="margin-top: 20px; padding: 10px;">
              <v-row>
                <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-start w-100">
                  <v-btn class="w-100" @click="handleSubmit" color="green">Odpovědět</v-btn>
                </v-col>
              </v-row>
              <v-row style="margin-top: 30px">
                <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-center w-100">
                  <v-btn class="w-100" @click="togglePause" >
                    <span style="width: 100px">{{ isPaused ? 'Pokračovat' : 'Pauza' }}</span>
                  </v-btn>
                </v-col>

                <!-- Tlačítko zarovnané vpravo, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-end w-100">
                  <v-btn class="w-100" @click="resetGame" color="#333333">Reset</v-btn>
                </v-col>
              </v-row>
            </div>
            <div style="margin-top: 20px; padding: 10px;">
              <v-row no-gutters>
                <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-start w-100">
                  <!-- Číselný vstup pro nastavení času -->
                  <v-text-field
                      v-model="timeSetting"
                      label="Nastavte čas (s)"
                      type="number"
                      :min="1"
                      outlined
                  />
                </v-col>
              </v-row>
              <h3>Učení</h3>
              <table>
                <tr v-for="(eq, index) in listToLearn" :key="index" style="text-align: center">
                  <td>{{padWithNonBreakingSpaces(index, 3)}}:</td> <td>{{eq.numA}}</td> <td> {{eq.sign}} </td> <td>{{eq.numB}}</td> <td> =</td> <td>{{eq.result}}</td>
                </tr>

              </table>
            </div>
          </div>
        </v-col>

        <!-- History container -->
        <v-col cols="4" class="history-container">
          <div class="history">
            <h3 style="text-align: center">Historie tahů: {{history.length}}</h3>
            <p>
              <StopWatch/>
            </p>
            <p>
              Mouse position is at: {{ x }}, {{ y }}
            </p>
            <div>TIME = {{ stopWatcher.time }} | {{ stopWatcher.timeMs }} ms</div>
            <div>
              <button @click="() => stopWatcher.start()">Start</button> |
              <button @click="() => stopWatcher.stop()">Stop</button> |
              <button @click="() => stopWatcher.reset()">Reset</button> |
            </div>
            <hr/>
<!--            <div>-->
<!--              <h1>History Learning Data:</h1>-->
<!--              <ul>-->
<!--                <li v-for="doc in historyLearningDocs" :key="doc.id">-->
<!--                  <p>Player Name: {{ doc.playerName }}</p>-->
<!--                  <p>Question: {{ doc.question }}</p>-->
<!--                  <p>User Answer: {{ doc.userAnswer }}</p>-->
<!--                  <p>Correct Answer: {{ doc.correctAnswer }}</p>-->
<!--                  <p>Is Correct: {{ doc.isCorrect }}</p>-->
<!--                  <p>Time (ms): {{ doc.timeMs }}</p>-->
<!--                </li>-->
<!--              </ul>-->
<!--            </div>-->
            <hr/>
            <div v-for="(entry, index) in history" :key="index" class="history-entry">
              <div :style="{ fontWeight: index === 0 ? 'bold' : 'normal'}">
                <span :style="{ color: entry.playerName === 'Tom' ? 'blue' : 'black', marginRight: '10px'}">{{ entry.playerName.charAt(0) }}:</span>
                <span>{{ entry.question }}</span> = <span v-if="entry.isCorrect" class="history-record-correct-answer">{{ entry.userAnswer }}</span>
                <span v-if="!entry.isCorrect">
                  <span class="history-record-wrong-answer">{{ entry.userAnswer ?? '×'}} </span> <span style="margin: 0 10px"> => </span><span class="history-record-correct-answer">{{ entry.correctAnswer}}</span>
                </span>
                <span>
                  čas: {{ entry.timeMs}} | {{ entry.time}}
                </span>

              </div>
              <hr v-if="index == 0" style="margin-bottom: 8px"/>
            </div>
          </div>
  <!--        <AnimeSprite :show-source-link="false" :transform-scale="0.5" :transform-origin="`bottom center`"/>-->
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import Numpad from "@/components/Numpad.vue";
import {
  type Criteria,
  type Equation,
  ESignType,
  getCrieteriaInfo, getSign,
  type HistoryRecord,
  type Interval, padWithNonBreakingSpaces
} from "@/utils/AddSubUtils";
import StopWatch from "@/components/StopWatch.vue";
import PuzzleImage from '@/components/PuzzleImage.vue'
import { useMouse } from '@vueuse/core'
import { StopWatcher } from '@/services/stopWatch'
import PlayerView from '@/components/game_components/player/PlayerCard.vue'


const { x, y } = useMouse()

const stopWatcher: StopWatcher = new StopWatcher();
// CONFIGURATION
const confTimeLeft = 20;
const configLearningMode = true;
// ----------

const learningMode = ref<boolean>(configLearningMode);
const currentPlayer = ref('Tom')
const userAnswer = ref<number|undefined>()
const question = ref('')
const currentAnswer = ref<number | null>(null)
const currentEquation = ref<Equation | null>(null);
const timer = ref<number | null>(null)
const timeLeft = ref(confTimeLeft)
const timeSetting = ref(confTimeLeft)
const IS_PAUSED_INIT = true;
const isPaused = ref(IS_PAUSED_INIT)
const message = ref('')
const history = ref<Array<HistoryRecord>>([])

const listToLearn = ref<Equation[]>([]);
const currentIndexListToLearn = ref<number>(0);

//Puzzle:
const puzzleRef = ref();

const revealNextPiece = () => {
  puzzleRef.value?.next();
};

const getRandomIntegerInclusive = (interval: Interval): number => {
  return getRandomIntegerInclusiveMinMax(interval.min, interval.max);
}

const getRandomIntegerInclusiveMinMax = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateQuestionsToLearn(): Equation[]{
  let eqList: Equation[] = [];
  let sign: string, isAddition: boolean;

  const crit: Criteria = {
    name: 'Level 1: 0,5 +',
    intervalA: { min: 0, max: 10 },
    sign: ESignType.PLUS,
    intervalB: { min: 0, max: 10 },
    intervalResult: { min: 0, max: 10 }
  };

  for (let a = crit.intervalA.min; a <= crit.intervalA.max; a++) {
    for (let b = crit.intervalB.min; b <= crit.intervalB.max && a + b <= crit.intervalResult.max; b++) {
      sign = getSign(crit.sign);
      isAddition = sign === '+';
      const eq: Equation = {
        numA: a,
        sign: sign,
        numB: b,
        result: isAddition ? a + b : a - b
      }
      eqList.push(eq);
    }
  }

  shuffle(eqList);
  return eqList;
}

function shuffle(array: any) {
  // https://stackoverflow.com/a/2450976/8494889
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function generateQuestionEquation(criteria: Criteria): Equation {
  let num1: number, num2: number, sign: string, isAddition: boolean;
  do {
    num1 = getRandomIntegerInclusive(criteria.intervalA);
    num2 = getRandomIntegerInclusive(criteria.intervalB);
    sign = getSign(criteria.sign);
    isAddition = sign === '+';

    question.value = isAddition ? `${num1} + ${num2}` : `${num1} - ${num2}`;
    currentAnswer.value = isAddition ? num1 + num2 : num1 - num2;

  } while (
         currentAnswer.value! < criteria.intervalResult.min
      || currentAnswer.value! > criteria.intervalResult.max
      || (currentAnswer.value === 0 && (num1 === 0 || num2 === 0))
      );

  const equation: Equation = {
    numA: num1,
    sign: sign,
    numB: num2,
    result: currentAnswer.value
  };

  currentEquation.value = equation;
  return equation;
}

function isActivePlayerClass(player: string): string {
  return currentPlayer.value === player ? 'active-player' : ''
}

function startTurn() {
  newQuestion();
  userAnswer.value = undefined
  startTimer()
  stopWatcher.start();
}

function newQuestion() {
  if (learningMode.value) {
    const eq = listToLearn.value[currentIndexListToLearn.value];
    let isAddition: boolean = eq.sign === '+';

    question.value = isAddition ? `${eq.numA} + ${eq.numB}` : `${eq.numA} - ${eq.numB}`;
    currentAnswer.value = isAddition ? eq.numA + eq.numB : eq.numA - eq.numB;

    currentIndexListToLearn.value = currentIndexListToLearn.value + 1;
  }
}

function startTimer() {
  if (timer.value) clearInterval(timer.value)
  timeLeft.value = timeSetting.value || 10
  timer.value = setInterval(() => {
    if (!isPaused.value) {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        clearInterval(timer.value!)
        handleSubmit()
      }
    }
  }, 1000) as unknown as number
}

// Funkce pro zvýšení hodnoty o 1
function incrementTimer() {
  timeSetting.value += 1;
}

// Funkce pro snížení hodnoty o 1
function decrementTimer() {
  timeSetting.value -= 1;
}

function resetGame() {
  currentPlayer.value = 'Tom'
  isPaused.value = IS_PAUSED_INIT;
  message.value = ''
  history.value = []
  currentIndexListToLearn.value = 0;
  startTurn()
}

function addHistoryEntry(isCorrect: boolean) {
  const historyRecord: HistoryRecord = {
    equation: currentEquation.value,
    question: question.value,
    playerName: currentPlayer.value,
    userAnswer: userAnswer.value,
    correctAnswer: currentAnswer.value,
    isCorrect: isCorrect,
    time: stopWatcher.time.value,
    timeMs: stopWatcher.timeMs.value
  }
  console.log("add history entry", historyRecord)
  history.value.unshift(historyRecord)
}

function handleSubmit() {
  console.log("handle Submit");
  stopWatcher.stop();
  clearInterval(timer.value!)
  const isCorrect = userAnswer.value !== undefined ? userAnswer.value === currentAnswer.value : false;
  if (isCorrect) {
    revealNextPiece();
  }
  addHistoryEntry(isCorrect)
  message.value = isCorrect
      ? `${currentPlayer.value} odpověděl správně!`
      : `${currentPlayer.value} odpověděl špatně!`
  if (!isCorrect) {
    console.log('correct');
    startTurn();
    return
  }
  startTurn();
}

function togglePause() {
  isPaused.value = !isPaused.value
}

onBeforeMount( () => {
  listToLearn.value = generateQuestionsToLearn();
})

onMounted(() => {
  resetGame();
})

// Přidejte klávesovou událost do okna, pokud potřebujete, aby fungovala i mimo div
window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSubmit(); // Zavolá handleSubmit při stisknutí Enter
  }
});
function triggerButton() {
  //handleSubmit(); // Volá se kliknutí na tlačítko
}

</script>

<style scoped>
/*
p, span, div {
  font-family: Arial, sans-serif;
  text-align: center;
  font-size: 2vw;
}
h1 {
  font-size: 5vw;
}
h2 {
  font-size: 3vw;
}
h3 {
  font-size: 2vw;
}
*/
.card-player {
  display: flex;
  flex-grow: 1;
  margin: 0 3px;
  padding: 2px;
}
.active-player {
  background-color: #ccfcc9;
}
.player {
}
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
.history-entry {
  margin-bottom: 0;
  font-size: 9px;
}
.history-entry span {
  display: inline-block;
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

/* History je zarovnaný v pravém horním rohu a roztažitelný na výšku */
.history-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Zarovná do pravého horního rohu */
  justify-content: flex-start;
  height: 100vh; /* Celá výška okna */
}

.history {
  background-color: #e0e0e0; /* Pozadí historie */
  padding: 5px;
  width: 100%; /* Roztažení na šířku */
  overflow-y: auto; /* Rolování v případě dlouhé historie */
}
.history h3 {
  font-size: 14px;
  font-weight: bold;
}

span.history-record-wrong-answer {
  /* text-decoration: line-through; */
  font-style: italic;
  color: red;
  margin: 0 !important;
}

span.history-record-correct-answer {
  color: green;
  margin: 0 !important;
}
</style>
