<template>
  <div v-if="calculations.length > 0" class="calculation-list">
    <p>Příklady:</p>
    <hr/>
    <div v-for="(calculation, index) in calculations" :key="index" class="calculation-item">
      <div class="calculation-content">
        <div class="calculation-part">{{ index }} | </div>
        <div class="calculation-part">{{ calculation.operandA }}</div>
        <div class="calculation-part operator">{{ calculation.operator }}</div>
        <div class="calculation-part">{{ calculation.operandB }}</div>
        <div class="calculation-part equal-sign">=</div>
        <div class="calculation-part result">?</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { type Calculation } from '@/types/calculationTypes';

const props = defineProps<{
  calculations: Calculation[];
}>();
</script>

<style scoped>
.calculation-list {
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding: 3px;
  font-size: 8px;
}

.calculation-item {
  margin: 0px;
}

.calculation-content {
  display: grid;
  grid-template-columns:
          minmax(20px, 1fr)
          minmax(20px, 1fr)
          minmax(6px, auto)
          minmax(20px, 1fr)
          minmax(6px, auto)
          minmax(20px, 1fr); /* Minimální šířka pro operátory a rovná se */
  gap: 2px;
  align-items: center;
}

.calculation-part {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.operator,
.equal-sign {
  min-width: 6px; /* Minimální šířka pro operátory a rovná se */
}

.result {
  text-align: right;
}

.result::before {
  content: ""; /* Přidá nějaký prostor pro záporné znaménko */
}
</style>
