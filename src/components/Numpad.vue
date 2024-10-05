<template>
  <div class="numpad">
    <div class="button-row">
      <v-btn @click="appendNumber(7)">7</v-btn>
      <v-btn @click="appendNumber(8)">8</v-btn>
      <v-btn @click="appendNumber(9)">9</v-btn>
    </div>
    <div class="button-row">
      <v-btn @click="appendNumber(4)">4</v-btn>
      <v-btn @click="appendNumber(5)">5</v-btn>
      <v-btn @click="appendNumber(6)">6</v-btn>
    </div>
    <div class="button-row">
      <v-btn @click="appendNumber(1)">1</v-btn>
      <v-btn @click="appendNumber(2)">2</v-btn>
      <v-btn @click="appendNumber(3)">3</v-btn>
    </div>
    <div class="button-row">
      <v-btn @click="appendNumber(0)">0</v-btn>
      <v-btn @click="backspace" icon="mdi-backspace"></v-btn>
      <v-btn @click="clearAll" icon="mdi-close-circle"></v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';

// Příjem prop userAnswer
const props = defineProps<{
  userAnswer: number|undefined;
}>();

// Dynamické nastavení userAnswer
const emit = defineEmits<(e: 'update:userAnswer', value: number | undefined) => void>();

function appendNumber(num: number) {
  emit('update:userAnswer', (props.userAnswer ?? 0) * 10 + num); // Přidání čísla
}

function backspace() {
  const newValue = Math.floor((props.userAnswer ?? 0) / 10); // Odstranění posledního čísla
  emit('update:userAnswer', newValue != 0 ? newValue : undefined);
}

function clearAll() {
  emit('update:userAnswer', undefined); // Resetování na 0
}

watch(props, () => {
  //console.log(`props.userAnswer ${props.userAnswer}`)
})

</script>

<style scoped>
.numpad {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(3, 1fr);
  gap: 10px; /* Mezery mezi tlačítky */
  max-width: 300px;
  max-height: 400px;
  margin: auto; /* Centering the numpad */
}

.button-row {
  display: contents; /* Allows the buttons to be laid out in grid */
}

.v-btn {
  height: 100%; /* Full height of the grid cell */
  min-height: 50px;
  width: 100%; /* Full width of the grid cell */
}
</style>
