<template>
  <v-dialog v-model="isOpen" max-width="350px" >
    <v-card>
      <v-card-title>Zadej level:</v-card-title>
      <v-text-field class="input-field" v-model="levelInput" label="Level. např.: <0,9>+-<0,9>=<0,10>" @input="onInput" />
      <v-card-actions class="action-container">
        <v-checkbox v-model="operatorPlus" label="+" class="checkbox-item" @change="updateOperatorsPlus" />
        <v-checkbox v-model="operatorMinus" label="-" class="checkbox-item" @change="updateOperatorsMinus" />
        <v-icon v-if="isValid" color="green">mdi-check-circle</v-icon>
        <v-btn @click="saveLevel" :disabled="!isValid">Set</v-btn>
        <v-btn @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useLevelStore } from '@/stores/useLevelStore';
import { type CalculationLevel, ECalculationOperator } from '@/types/calculationTypes';
import Cookies from 'js-cookie';

const isOpen = ref(false);
const operatorPlus = ref(false);
const operatorMinus = ref(false);
const levelInput = ref('');
const store = useLevelStore();

const operator = computed(() => {
  if (operatorPlus.value && operatorMinus.value) return ECalculationOperator.PLUS_MINUS;
  if (operatorPlus.value) return ECalculationOperator.PLUS;
  if (operatorMinus.value) return ECalculationOperator.MINUS;
  return null;
});

const isValid = computed(() => /<\d+,\d+>(\+|-|\+-)<\d+,\d+>=<\d+,\d+>/.test(levelInput.value));

watch(levelInput, (newValue) => {
  operatorPlus.value = newValue.includes('+');
  operatorMinus.value = newValue.includes('-');
});

function updateOperatorsBoth() {
  // Pokud nejsou vybrány žádné operátory, nahradíme všechny + a - znakem ?
  if (!operatorPlus.value && !operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/>[+-]+</, '>?<');
  }
  // Pokud jsou vybrány oba operátory, nahradíme všechny + a - kombinací +- (jediný výskyt)
  else if (operatorPlus.value && operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/[-+]/g, '+-');
  }
  // Pokud žádná podmínka není splněna, použijeme ?
  else {
    levelInput.value = levelInput.value.replace(/>[+-]+</, '>?<');
  }
}

function updateOperatorsPlus() {
  if (operatorPlus.value && operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/-/, '+-');
  }
  else if (!operatorPlus.value && !operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/>[+-]+</, '>?<');
  }
  else if (!operatorPlus.value && operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/[+]/, '');
  }
  else if (operatorPlus.value && !operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/[?]/, '+');
    levelInput.value = levelInput.value.replace(/></, '>+<');
  }
  else {
    levelInput.value = levelInput.value.replace(/>[+-]+</, '>?<');
  }
}

function updateOperatorsMinus() {
  if (operatorPlus.value && operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/[+]/, '+-');
  }
  else if (!operatorPlus.value && !operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/>[+-]+</, '>?<');
  }
  else if (operatorPlus.value && !operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/[-]/, '');
  }
  else if (!operatorPlus.value && operatorMinus.value) {
    levelInput.value = levelInput.value.replace(/[?]/, '-');
    levelInput.value = levelInput.value.replace(/></, '>-<');
  }
  else {
    levelInput.value = levelInput.value.replace(/>[+-]+</, '>?<');
  }
}


function onInput() {
  // Automatické doplňování formátu (bude doplněno později)
}

function saveLevel() {
  if (!isValid.value || !operator.value) return;

  const match = levelInput.value.match(/<\d+,\d+>[+-]+<\d+,\d+>=<\d+,\d+>/);
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
  }
  else {
    const savedLevel = Cookies.get('calculationLevel');
    if (savedLevel) {
      const parsedLevel: CalculationLevel = JSON.parse(savedLevel);
      levelInput.value = parsedLevel.Name;
    }
  }
  if (levelInput.value === '') {
    levelInput.value = '<0,9>+-<0,9>=<0,10>'
  }
});

// 👇 Expose `isOpen` so that the parent can control it
defineExpose({ isOpen });
</script>

<style scoped>
.input-field {
  padding: 0 10px;
}

.checkbox-item {
    display: flex;
    flex-flow: nowrap;
}

.action-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
