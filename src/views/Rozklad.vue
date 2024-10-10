<template>
  <v-container class="d-flex justify-center align-center" style="position: relative; height: 280px;">
    <!-- Čáry mezi obdélníky (pod obdélníky) -->
    <svg style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1;">
      <!-- Čára z obdélníku 1 do obdélníku 2 -->
      <line x1="50%" y1="75" x2="70" y2="225" stroke="black" stroke-width="2" />
      <!-- Čára z obdélníku 1 do obdélníku 3 -->
      <line x1="50%" y1="75" x2="calc(100% - 70px)" y2="225" stroke="black" stroke-width="2" />
      <!-- Čára mezi obdélníky 2 a 3 -->
<!--      <line x1="70" y1="225" x2="calc(100% - 70px)" y2="225" stroke="black" stroke-width="2" />-->
    </svg>

    <!-- Obdélník 1 -->
    <v-sheet
        width="100"
        height="50"
        class="d-flex justify-center align-center"
        style="position: absolute; top: 50px; left: 50%; transform: translateX(-50%); z-index: 2;"
        elevation="3"
    >
      <span>{{ numberResult }}</span>
    </v-sheet>

    <!-- Obdélník 2 -->
    <v-sheet
        width="100"
        height="50"
        class="d-flex justify-center align-center"
        style="position: absolute; top: 200px; left: 20px; z-index: 2;"
        elevation="3"
    >
      <span>{{ number1 }}</span>
    </v-sheet>

    <!-- Obdélník 3 -->
    <v-sheet
        width="100"
        height="50"
        class="d-flex justify-center align-center"
        style="position: absolute; top: 200px; right: 20px; z-index: 2;"
        elevation="3"
    >
      <span>{{ userAnswer }}</span>
    </v-sheet>
  </v-container>
  <div class="pa-1 ma-1">
    <Numpad v-model:userAnswer="userAnswer" />
  </div>
  <v-btn class="w-100" @click="handleSubmit" color="green">Odpovědět</v-btn>

  <div class="history">
    <h3 style="text-align: center">Historie tahů: {{history.length}}</h3>
    <div v-for="(entry, index) in history" :key="index" class="history-entry">
      <div :style="{ fontWeight: index === 0 ? 'bold' : 'normal' , fontSize: index === 0 ? '14px' : '10px'}">
        <span>{{ entry.question }}</span>
        <span :style="{ color: entry.isCorrect ? 'green' : 'red' }"> {{ entry.answer }}</span>
      </div>
      <hr v-if="index == 0" style="margin-bottom: 8px"/>
    </div>
  </div>

</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import Numpad from "@/components/Numpad.vue";

const maxNumber = 10
const number1 = ref(3)
const number2 = ref(5)
const numberResult = ref(8)

const userAnswer = ref<number|undefined>()
const history = ref<Array<{ question: string, answer: number, isCorrect: boolean }>>([])
const question = ref('')
const currentAnswer = ref<number | null>(null)


function generateQuestion() {
  let num1, result
  do {
    num1 = Math.floor(Math.random() * (maxNumber + 1))
    result = Math.floor(Math.random() * (maxNumber + 1))
    question.value = `${result} = ${num1} + `
    currentAnswer.value = result - num1
    console.log("generating", result, num1)
    number1.value = num1;
    numberResult.value = result;
  } while (currentAnswer.value! <= 0 || currentAnswer.value! >= maxNumber || num1 === 0)
}

function startTurn() {
  generateQuestion()
  userAnswer.value = undefined
}

function handleSubmit() {
  console.log("handle Submit")
  const isCorrect = numberResult.value === number1.value + (userAnswer.value ?? 0)
  addHistoryEntry(isCorrect)
  startTurn()
}

function addHistoryEntry(isCorrect: boolean) {
  console.log("add history entry")
  const entry = {
    question: question.value,
    answer: currentAnswer.value!,
    isCorrect
  };
  history.value.unshift(entry)
}

onMounted(() => {
  startTurn()
})
</script>

<style scoped>
</style>
