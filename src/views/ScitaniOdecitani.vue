<template>
  <v-container fluid>
    <v-row>
      <!-- Playboard container -->
      <v-col cols="8" class="playboard-container">
        <v-container class="playboard">
          <h1>Počítací střílečka</h1>

          <v-container>
            <v-row>
              <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-start w-100">
                <v-card>
                  <div class="player">
                    <h2>Tom</h2>
                    <p>Životy: <span>{{ tomLives }}</span></p>
                  </div>
                </v-card>
              </v-col>
              <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-center w-100">
                <v-card>
                  <div class="player">
                    <h2>Protihráč</h2>
                    <p>Životy: <span>{{ opponentLives }}</span></p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-start w-100">
                <div id="question">{{ question }} = {{ userAnswer ?? '?'}}</div>
              </v-col>
              <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-center w-100">
                <div id="timer">Čas: {{ timeLeft }}</div>
              </v-col>
            </v-row>
          </v-container>

          <p>{{ message }}</p>

          <v-container>
            <v-row>
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
              <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-center w-100">
                <!-- Textový vstup pro odpověď -->
                <v-text-field
                    v-model="userAnswer"
                    label="Vaše odpověď"
                    @keydown.enter="handleSubmit"
                    outlined
                />
              </v-col>
            </v-row>
          </v-container>

          <v-container>
            <Numpad v-model:userAnswer="userAnswer" />
          </v-container>

          <v-container>
            <v-row>
              <!-- Tlačítko zarovnané vlevo, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-start w-100">
                <v-btn class="w-100" @click="handleSubmit" :disabled="!playersAreAlive()">Odpovědět</v-btn>
              </v-col>

              <!-- Tlačítko zarovnané uprostřed, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-center w-100">
                <v-btn class="w-100" @click="togglePause" :disabled="!playersAreAlive()">
                  <span style="width: 100px">{{ isPaused ? 'Pokračovat' : 'Pauza' }}</span>
                </v-btn>
              </v-col>

              <!-- Tlačítko zarovnané vpravo, zabírá 100% šířky svého sloupce -->
              <v-col class="d-flex justify-end w-100">
                <v-btn class="w-100" @click="resetGame">Reset</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-container>
      </v-col>

      <!-- History container -->
      <v-col cols="4" class="history-container">
        <v-container class="history">
          <h3>Historie tahů</h3>
          <div v-for="(entry, index) in history" :key="index" class="history-entry">
            <span :style="{ color: entry.player === 'Tom' ? 'blue' : 'black' }">{{ entry.player }}:</span>
            <span>{{ entry.question }}</span>
            <span :style="{ color: entry.isCorrect ? 'green' : 'red' }">= {{ entry.answer }}</span>
          </div>
        </v-container>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Numpad from "@/components/Numpad.vue";

const maxLives = 3;
const confTimeLeft = 10;

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
  currentPlayer.value = currentPlayer.value === 'Tom' ? 'Protihráč' : 'Tom'
  message.value = `Hraje ${currentPlayer.value}`
  startTurn()
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
        loseLife()
        addHistoryEntry(false)
      }
    }
  }, 1000) as unknown as number
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
  history.value.push({
    player: currentPlayer.value,
    question: question.value,
    answer: currentAnswer.value!,
    isCorrect
  })
}

function handleSubmit() {
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
body {
  font-family: Arial, sans-serif;
  text-align: center;
}
*/
.player {
  margin: 20px;
}
#question {
  font-size: 24px;
  margin: 20px;
}
#timer {
  font-size: 24px;
  color: red;
  margin: 20px;
}
.history-entry {
  margin-bottom: 3px;
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
  padding: 20px;
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
  padding: 20px;
  width: 100%; /* Roztažení na šířku */
  max-height: 100%; /* Roztažení na výšku */
  overflow-y: auto; /* Rolování v případě dlouhé historie */
}
</style>
