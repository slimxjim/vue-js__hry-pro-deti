<template>
  <span class="question"><span class="questionId">{{ currentTurnIndexInGameScenario }} | </span>
    {{ currentQuestion?.operandA }}
    {{ currentQuestion?.operator }}
    {{ currentQuestion?.operandB }}
    = {{ userAnswer ?? '?'}}
  </span>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { type Calculation } from '@/types/calculationTypes'

const props = defineProps<{
  currentTurnIndexInGameScenario?: number
  currentQuestion?: Calculation;
  userAnswer?: number;
}>();

</script>

<style scoped>
.questionId {
    opacity: 0.3;
}
.question {
  font-size: large;
    font-weight: bold;
    text-align: left;
}
</style>
