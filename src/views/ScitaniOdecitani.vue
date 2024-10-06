<template>
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
          </div>
        <AnimeSprite :show-source-link="false" :transform-scale="0.5" :transform-origin="`bottom center`"/>
        </div>
      </v-col>

      <!-- History container -->
      <v-col cols="4" class="history-container">
        <div class="history">
          <h3 style="text-align: center">Historie tahů: {{history.length}}</h3>
          <div v-for="(entry, index) in history" :key="index" class="history-entry">
            <div :style="{ fontWeight: index === 0 ? 'bold' : 'normal' , fontSize: index === 0 ? '14px' : '10px'}">
              <span :style="{ color: entry.player === 'Tom' ? 'blue' : 'black' }">{{ entry.player.charAt(0) }}:</span>
              <span>{{ entry.question }}</span>
              <span :style="{ color: entry.isCorrect ? 'green' : 'red' }">= {{ entry.answer }}</span>
            </div>
            <hr v-if="index == 0" style="margin-bottom: 8px"/>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Numpad from "@/components/Numpad.vue";
import AnimeSprite from "@/components/playground/AnimeSprite.vue";

const maxLives = 3;
const confTimeLeft = 20;

const tomLives = ref(maxLives)
const opponentLives = ref(maxLives)
const currentPlayer = ref('Tom')
const userAnswer = ref<number|undefined>()
const question = ref('')
const currentAnswer = ref<number | null>(null)
const timer = ref<number | null>(null)
const timeLeft = ref(confTimeLeft)
const timeSetting = ref(confTimeLeft)
const isPaused = ref(false)
const message = ref('')
const history = ref<Array<{ player: string, question: string, answer: number, isCorrect: boolean }>>([])

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
  generateQuestion()
  userAnswer.value = undefined
  startTimer()
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
  isPaused.value = false
  message.value = ''
  history.value = []
  startTurn()
}

function addHistoryEntry(isCorrect: boolean) {
  console.log("add history entry")
  const entry = {
    player: currentPlayer.value,
    question: question.value,
    answer: currentAnswer.value!,
    isCorrect
  };
  history.value.unshift(entry)
}

function handleSubmit() {
  console.log("handle Submit")
  clearInterval(timer.value!)
  const isCorrect = (userAnswer.value ?? 0) === currentAnswer.value
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
  margin-bottom: 0px;
  text-wrap: nowrap;
  font-size: 10px;
}
.history-entry span {
  display: inline-block;
  margin-left: 10px;
}
/* Playboard má vyplňovat celý levý prostor */
.playboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh; /* Celá výška okna */
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
</style>
