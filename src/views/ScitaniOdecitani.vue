<template>
  <div>
    <h1>Počítací střílečka</h1>

    <div class="player">
      <h2>Tom</h2>
      <p>Životy: <span>{{ tomLives }}</span></p>
    </div>

    <div class="player">
      <h2>Protihráč</h2>
      <p>Životy: <span>{{ opponentLives }}</span></p>
    </div>

    <div id="question">{{ question }}</div>
    <div id="timer">Čas: {{ timeLeft }}</div>

    <input type="number" v-model="timeSetting" placeholder="Nastavte čas (s)" min="1" />
    <input type="text" v-model="userAnswer" placeholder="Vaše odpověď" @keydown.enter="handleSubmit" />

    <button @click="handleSubmit">Odpovědět</button>
    <button @click="togglePause">{{ isPaused ? 'Pokračovat' : 'Pauza' }}</button>
    <button @click="resetGame">Reset</button>

    <p>{{ message }}</p>

    <div id="history">
      <h3>Historie tahů</h3>
      <div v-for="(entry, index) in history" :key="index" class="history-entry">
        <span :style="{ color: entry.player === 'Tom' ? 'blue' : 'black' }">{{ entry.player }}:</span>
        <span>{{ entry.question }}</span>
        <span :style="{ color: entry.isCorrect ? 'green' : 'red' }">= {{ entry.answer }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const tomLives = ref(3)
const opponentLives = ref(3)
const currentPlayer = ref('Tom')
const userAnswer = ref('')
const question = ref('')
const currentAnswer = ref<number | null>(null)
const timer = ref<number | null>(null)
const timeLeft = ref(10)
const timeSetting = ref(10)
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
  userAnswer.value = ''
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

function endGame() {
  clearInterval(timer.value!)
  const winner = tomLives.value > 0 ? 'Tom' : 'Protihráč'
  message.value = `${winner} vyhrál! Hra skončila.`
}

function resetGame() {
  tomLives.value = 3
  opponentLives.value = 3
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
  const isCorrect = parseInt(userAnswer.value) === currentAnswer.value
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
body {
  font-family: Arial, sans-serif;
  text-align: center;
}
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
#history {
  border: 2px solid black;
  padding: 10px;
  text-align: left;
  position: absolute;
  top: 10px;
  left: 10px;
  max-width: 300px;
}
.history-entry {
  margin-bottom: 5px;
}
.history-entry span {
  display: inline-block;
  margin-left: 10px;
}
</style>
