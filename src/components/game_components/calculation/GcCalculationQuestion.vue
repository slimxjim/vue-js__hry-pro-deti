<template>
  <span id="question"><span class="questionId">{{ currentTurnIndexInGameScenario }} | </span>
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
</style>
