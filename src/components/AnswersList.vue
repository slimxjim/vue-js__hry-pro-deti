<template>
  <div v-if="answers.length > 0" class="calculation-list">
    <p>Odpovědi:</p>
    <hr/>
    <div v-for="(answer, index) in answers" :key="index" class="calculation-item">
      <div class="calculation-content">
        <div class="calculation-part">{{ index }} | </div>
        <div class="calculation-part">{{ answer.calculation.operandA }}</div>
        <div class="calculation-part operator">{{ answer.calculation.operator }}</div>
        <div class="calculation-part">{{ answer.calculation.operandB }}</div>
        <div class="calculation-part equal-sign">=</div>
        <div class="calculation-part negative-sign"><span v-if="answer.calculation.correctAnswer < 0">-</span><span v-else>&nbsp;</span></div>
        <div class="calculation-part result">
          <div v-if="answer.isCorrect" class="correct-answer">{{ absolute(answer.answer) }}</div>
          <div v-else>
            <span class="correct-answer">{{ absolute(answer.calculation.correctAnswer) }}</span>
            <span class="answer-correct-separator">&nbsp;</span>
            <span class="not-correct-answer strike-diagonal-price">&nbsp;{{ answer.answer ?? '?' }}&nbsp;</span>
          </div>
        </div>
        <div class="calculation-part-time">
          <TimeWatchSpan :time="answer.answerTimeFirst"/> / <TimeWatchSpan :time="answer.answerTimeTotal"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { type CalculationAnswer } from '@/types/calculationTypes'
import { logger } from '@/services/Logger'
import TimeWatchSpan from '@/components/TimeWatchSpan.vue'

const props = defineProps<{
  answers: CalculationAnswer[];
}>();

function absolute(answer: number | undefined): number | undefined {
  // logger.debug('absolut answer = ', '', answer);
  if (answer == 0) {
    return 0;
  }
  return answer ? Math.abs(answer) : undefined;
}

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
    minmax(30px, 1em) /* index */
    minmax(10px, 1em) /* A */
    minmax(5px, 1em)   /* +- */
    minmax(10px, 1em) /* B */
    minmax(5px, 1em)  /* = */
    minmax(3px, 1em)  /* - */
    minmax(20px, 5em) /* answer */
    minmax(15px, 15em) /* times */
    ;
  gap: 2px;
  align-items: center;
}

.calculation-part {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calculation-part-time {
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.operator {
  min-width: 6px; /* Minimální šířka pro operátory a rovná se */
}
.equal-sign {
  min-width: 6px; /* Minimální šířka pro operátory a rovná se */
  margin-right: 6px;
}

.negative-sign {
  min-width: 6px; /* Minimální šířka pro operátory a rovná se */
  text-align: right;
}

.result {
  text-align: left;
}

.result::before {
  content: ""; /* Přidá nějaký prostor pro záporné znaménko */
}

.correct-answer {
  color: #2cff00;
}

.not-correct-answer {
  color: #d50000;
}

.answer-correct-separator {
  margin: 0 3px;
}

.strikethrough {
  position: relative;
}
.strikethrough:before {
  position: absolute;
  content: "";
  left: 0;
  top: 50%;
  right: 0;
  border-top: 1px solid;
  border-color: inherit;
  opacity: 0.25;
  color: #ff0000;

  -webkit-transform:rotate(-5deg);
  -moz-transform:rotate(-5deg);
  -ms-transform:rotate(-5deg);
  -o-transform:rotate(-5deg);
  transform:rotate(-5deg);
}

.strikediag {
  background: linear-gradient(to left top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%);
}
.withpadding {
  padding: 0 0.15em;
}

.strike-diagonal-price {
  position: relative;
}

.strike-diagonal-price:before {
  position: absolute;
  content: "";
  left: 0;
  top: 45%;
  right: 0;
  border-top: 1px solid;
  border-color: rgba(0, 0, 0, 0.59);
  opacity: 0.3;
  -webkit-transform: rotate(-25deg);
  -moz-transform: rotate(-25deg);
  -ms-transform: rotate(-25deg);
  -o-transform: rotate(-25deg);
  transform: rotate(-25deg);
}

</style>
