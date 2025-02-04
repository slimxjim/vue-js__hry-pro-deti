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
                      <h2>Tom</h2>
                      <p>Životy: <span>{{ tomLives }}</span></p>
                    </div>
                  </v-card>
                </v-col>
                <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-center w-100">
                  <v-card :class="[isActivePlayerClass('Protihráč'), 'card-player']">
                    <div class="player">
                      <h2>Protihráč</h2>
                      <p>Životy: <span>{{ opponentLives }}</span></p>
                    </div>
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
                  <v-btn class="w-100" @click="handleSubmit" :disabled="!playersAreAlive()" color="green">Odpovědět</v-btn>
                </v-col>
              </v-row>
              <v-row style="margin-top: 30px">
                <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
                <v-col class="d-flex justify-center w-100">
                  <v-btn class="w-100" @click="togglePause" :disabled="!playersAreAlive()">
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
              <h3>Levely</h3>
              <v-row>
                <v-col v-for="(crit, index) in criterieasLevels" :key="index">
                  <v-btn class="w-100" @click="changeLevel(crit)" color="#333333">{{ crit.name }}</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>{{ getCrieteriaInfo(currentCriteria) }}</div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>

        <!-- History container -->
        <v-col cols="4" class="history-container">
          <div class="history">
            <h3 style="text-align: center">Historie tahů: {{history.length}}</h3>
            <div v-for="(entry, index) in history" :key="index" class="history-entry">
              <div :style="{ fontWeight: index === 0 ? 'bold' : 'normal'}">
                <span :style="{ color: entry.playerName === 'Tom' ? 'blue' : 'black', marginRight: '10px'}">{{ entry.playerName.charAt(0) }}:</span>
                <span>{{ entry.question }}</span> = <span v-if="entry.isCorrect" class="history-record-correct-answer">{{ entry.userAnswer }}</span>
                <span v-if="!entry.isCorrect">
                  <span class="history-record-wrong-answer">{{ entry.userAnswer ?? '×'}} </span> <span style="margin: 0 10px"> => </span><span class="history-record-correct-answer">{{ entry.correctAnswer}}</span>
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
import { ref, onMounted } from 'vue'
import Numpad from "@/components/Numpad.vue";
import {
  type Criteria,
  type Equation,
  ESignType,
  getCrieteriaInfo, getSign,
  type HistoryRecord,
  type Interval
} from "@/utils/AddSubUtils";

// CONFIGURATION
const maxLives = 3;
const confTimeLeft = 20;

const crit_Level1_plus: Criteria = {
  name: 'Level 1: 0,5 +',
  intervalA: { min: 0, max: 5 },
  sign: ESignType.PLUS,
  intervalB: { min: 0, max: 5 },
  intervalResult: { min: 0, max: 10 }
};
const crit_Level2_plus_0_10: Criteria = {
  name: 'Level 2: 0,10 +',
  intervalA: { min: 0, max: 10},
  sign: ESignType.PLUS,
  intervalB: { min: 0, max: 10},
  intervalResult: { min: 0, max: 10 }
};
const crit_Level3_minus_0_5: Criteria = {
  name: 'Level 3: 0,5 -',
  intervalA: { min: 0, max: 5},
  sign: ESignType.MINUS,
  intervalB: { min: 0, max: 5},
  intervalResult: { min: 0, max: 10 }
};
const crit_Level4_minus_0_10: Criteria = {
  name: 'Level 4: 0,10 -',
  intervalA: { min: 0, max: 10},
  sign: ESignType.MINUS,
  intervalB: { min: 0, max: 10},
  intervalResult: { min: 0, max: 10 }
};
const crit_Level4_minus_1_10: Criteria = {
  name: 'Level 4: 1,10 -',
  intervalA: { min: 2, max: 10},
  sign: ESignType.MINUS,
  intervalB: { min: 2, max: 10},
  intervalResult: { min: 1, max: 10 }
};
const crit_Level5_both_0_10: Criteria = {
  name: 'Level 5: 0,10 +/-',
  intervalA: { min: 0, max: 10},
  sign: ESignType.PLUS_MINUS,
  intervalB: { min: 0, max: 10},
  intervalResult: { min: 0, max: 10 }
};

const criterieasLevels = ref<Array<Criteria>> ([
  crit_Level1_plus,
  crit_Level2_plus_0_10,
  crit_Level3_minus_0_5,
  crit_Level4_minus_0_10,
  crit_Level4_minus_1_10,
  crit_Level5_both_0_10,
]);

const tomLives = ref(maxLives)
const opponentLives = ref(maxLives)
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

const currentCriteria = ref<Criteria>(crit_Level1_plus);



const getRandomIntegerInclusive = (interval: Interval): number => {
  return getRandomIntegerInclusiveMinMax(interval.min, interval.max);
}

const getRandomIntegerInclusiveMinMax = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
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

function changeLevel(criteria: Criteria) {
  currentCriteria.value = criteria;
  newQuestion();
}

function generateQuestion() {
  let num1, num2, isAddition
  do {
    num1 = Math.floor(Math.random() * 21)
    num2 = Math.floor(Math.random() * 21)
    isAddition = Math.random() > 0.5
    question.value = isAddition ? `${num1} + ${num2}` : `${num1} - ${num2}`
    currentAnswer.value = isAddition ? num1 + num2 : num1 - num2
  } while (currentAnswer.value! < 0 || currentAnswer.value! > 20)
}

function switchPlayer() {
  console.log("switch player", currentPlayer.value)
  currentPlayer.value = currentPlayer.value === 'Tom' ? 'Protihráč' : 'Tom'
  message.value = `Hraje ${currentPlayer.value}`
  startTurn()
}

function isActivePlayerClass(player: string): string {
  return currentPlayer.value === player ? 'active-player' : ''
}

function startTurn() {
  newQuestion();
  userAnswer.value = undefined
  startTimer()
}

function newQuestion() {
  //generateQuestion()
  generateQuestionEquation(currentCriteria.value);
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
        // loseLife()
        // addHistoryEntry(false)
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

function loseLife() {
  clearInterval(timer.value!)
  if (currentPlayer.value === 'Tom') {
    tomLives.value--
  } else {
    opponentLives.value--
  }
  if (tomLives.value === 0 || opponentLives.value === 0) {
    endGame()
  } else {
    switchPlayer()
  }
}

function playersAreAlive(): boolean {
  const playersAreAlive: boolean = tomLives.value > 0 && opponentLives.value > 0;
  return playersAreAlive;
}

function endGame() {
  clearInterval(timer.value!)
  const winner = tomLives.value > 0 ? 'Tom' : 'Protihráč'
  message.value = `${winner} vyhrál! Hra skončila.`
}

function resetGame() {
  tomLives.value = maxLives
  opponentLives.value = maxLives
  currentPlayer.value = 'Tom'
  isPaused.value = IS_PAUSED_INIT;
  message.value = ''
  history.value = []
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
    timeMs: 0,
    time: '0'
  }
  console.log("add history entry", historyRecord)
  history.value.unshift(historyRecord)
}

function handleSubmit() {
  console.log("handle Submit")
  clearInterval(timer.value!)
  const isCorrect = userAnswer.value !== undefined ? userAnswer.value === currentAnswer.value : false;
  addHistoryEntry(isCorrect)
  message.value = isCorrect
      ? `${currentPlayer.value} odpověděl správně!`
      : `${currentPlayer.value} odpověděl špatně!`
  if (!isCorrect) {
    loseLife()
    return
  }
  switchPlayer()
}

function togglePause() {
  isPaused.value = !isPaused.value
}

onMounted(() => {
  resetGame()
})

// Přidejte klávesovou událost do okna, pokud potřebujete, aby fungovala i mimo div
window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (tomLives.value > 0 || opponentLives.value > 0)) {
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
