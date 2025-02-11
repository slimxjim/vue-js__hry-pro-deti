<template>
  <div class="numpad">
    <div class="button-row">
      <v-btn @click="appendNumber(7)"><span class="num-number">7</span></v-btn>
      <v-btn @click="appendNumber(8)"><span class="num-number">8</span></v-btn>
      <v-btn @click="appendNumber(9)"><span class="num-number">9</span></v-btn>
    </div>
    <div class="button-row">
      <v-btn @click="appendNumber(4)"><span class="num-number">4</span></v-btn>
      <v-btn @click="appendNumber(5)"><span class="num-number">5</span></v-btn>
      <v-btn @click="appendNumber(6)"><span class="num-number">6</span></v-btn>
    </div>
    <div class="button-row">
      <v-btn @click="appendNumber(1)"><span class="num-number">1</span></v-btn>
      <v-btn @click="appendNumber(2)"><span class="num-number">2</span></v-btn>
      <v-btn @click="appendNumber(3)"><span class="num-number">3</span></v-btn>
    </div>
    <div class="button-row">
      <v-btn @click="appendNumber(0)"><span class="num-number">0</span></v-btn>
      <v-btn @click="backspace"><span class="num-number"><v-icon icon="mdi-backspace" color="blue"/></span></v-btn>
      <v-btn @click="clearAll"><span class="num-number"><v-icon icon="mdi-close-circle" color="red"/></span></v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeUnmount, onMounted, watch } from 'vue'

// Příjem prop userAnswer
const props = defineProps<{
  userAnswer: number | undefined;
}>();

// Dynamické nastavení userAnswer
const emit = defineEmits<{
  (e: 'update:userAnswer', value: number | undefined): void;
  (e: 'start-answering'): void;
  (e: 'continue-answering'): void;
}>();

function appendNumber(num: number) {
  emit('start-answering');
  emit('update:userAnswer', (props.userAnswer ?? 0) * 10 + num); // Přidání čísla
}

function backspace() {
  const newValue = Math.floor((props.userAnswer ?? 0) / 10); // Odstranění posledního čísla
  emit('update:userAnswer', newValue !== 0 ? newValue : undefined);
  if(newValue === 0) {
    emit('continue-answering');
  }
}

function clearAll() {
  emit('update:userAnswer', undefined); // Resetování na 0
  emit('continue-answering');
}

const handleKeyPress = (event: KeyboardEvent) => {
  const key = event.key;
  const num = parseInt(key, 10);

  const activeElement = document.activeElement as HTMLElement;
  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
    console.trace('ignoring key event for input or textarea');
    return;
  }

  if (!isNaN(num) && num >= 0 && num <= 9) {
    appendNumber(num); // Call appendNumber if the key pressed is a number
  }

  if (key === 'Backspace') {
    backspace();
  }

  if (key === 'Delete') {
    clearAll();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress); // Add event listener on mount
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress); // Clean up event listener
});

watch(props, () => {
  //console.log(`props.userAnswer ${props.userAnswer}`)
});
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
  min-height: 60px;
  min-width: 40px;
  width: 100%; /* Full width of the grid cell */
  padding: 0;
}

.num-number {
  font-weight: bold;
  font-size: 24px;
}
</style>
