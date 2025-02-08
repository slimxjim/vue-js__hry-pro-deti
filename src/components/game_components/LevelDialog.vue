<template>
  <v-dialog v-model="isOpen" max-width="400px">
    <v-card>
      <v-card-title>Set Level</v-card-title>
      <v-card-text>
        <v-checkbox v-model="operatorPlus" label="+" />
        <v-checkbox v-model="operatorMinus" label="-" />
        <v-text-field v-model="levelInput" label="Enter level" @input="onInput" />
        <v-icon v-if="isValid" color="green">mdi-check-circle</v-icon>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="saveLevel" :disabled="!isValid">Set</v-btn>
        <v-btn @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLevelStore } from '@/stores/useLevelStore';
import Cookies from 'js-cookie';
import { type CalculationLevel, ECalculationOperator } from '@/types/calculationTypes'

const isOpen = ref(false);
const operatorPlus = ref(true);
const operatorMinus = ref(true);
const levelInput = ref('');
const store = useLevelStore();

const operator = computed(() => {
  if (operatorPlus.value && operatorMinus.value) return ECalculationOperator.PLUS_MINUS;
  if (operatorPlus.value) return ECalculationOperator.PLUS;
  if (operatorMinus.value) return ECalculationOperator.MINUS;
  return null;
});

const isValid = computed(() => /<\d+,\d+>[+-]+<\d+,\d+>=<\d+,\d+>/.test(levelInput.value));

function onInput() {
  // Automatické doplňování formátu (bude doplněno později)
}

function saveLevel() {
  if (!isValid.value || !operator.value) return;

  const match = levelInput.value.match(/<(\d+),(\d+)>[+-]+<(\d+),(\d+)>=<(\d+),(\d+)>/);
  if (!match) return;

  const level: CalculationLevel = {
    Type: operator.value === ECalculationOperator.PLUS_MINUS ? 'plus mínus' : operator.value,
    Name: levelInput.value,
    MinA: Number(match[1]),
    MaxA: Number(match[2]),
    Operator: operator.value,
    MinB: Number(match[3]),
    MaxB: Number(match[4]),
    MinResult: Number(match[5]),
    MaxResult: Number(match[6]),
    Description: ''
  };

  store.setLevel(level);
  Cookies.set('calculationLevel', JSON.stringify(level), { expires: 30 });
  close();
}

function close() {
  isOpen.value = false;
}

// Načtení uloženého levelu při otevření dialogu
onMounted(() => {
  if (store.level) {
    levelInput.value = store.level.Name;
  } else {
    const savedLevel = Cookies.get('calculationLevel');
    if (savedLevel) {
      const parsedLevel: CalculationLevel = JSON.parse(savedLevel);
      levelInput.value = parsedLevel.Name;
    }
  }
});

// 👇 Expose `isOpen` so that the parent can control it
defineExpose({ isOpen });
</script>
