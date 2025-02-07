<template>
  <div v-if="answers.length > 0" class="calculation-list">
    <p>Odpovědi:</p>
    <hr/>
    <div v-for="(answer, index) in answers" :key="index" class="calculation-item">
      <div :class="[isTimeVisibleFirstR ? 'calculation-content' : 'calculation-content-no-time']">
        <div class="calculation-id">{{ index }} | </div>
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
        <div v-if="isTimeVisibleFirstR" class="calculation-part-time1">
          <TimeWatchSpan :time="answer.answerTimeFirst"/>
        </div>
        <div v-if="isTimeVisibleFirstR || isTimeVisibleTotalR" class="calculation-part-sep">
          /
        </div>
        <div v-if="isTimeVisibleTotalR" class="calculation-part-time2">
          <TimeWatchSpan :time="answer.answerTimeTotal"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, onMounted, onUnmounted, ref } from 'vue'
import { type CalculationAnswer } from '@/types/calculationTypes'
import { logger } from '@/services/Logger'
import TimeWatchSpan from '@/components/TimeWatchSpan.vue'

const props = defineProps<{
  answers: CalculationAnswer[];
  isTimeVisibleFirst?: boolean;
  isTimeVisibleTotal?: boolean
}>();

const isTimeVisibleFirstR = ref<boolean>(props.isTimeVisibleFirst)
const isTimeVisibleTotalR = ref<boolean>(props.isTimeVisibleTotal)

function absolute(answer: number | undefined): number | undefined {
  // logger.debug('absolut answer = ', '', answer);
  if (answer == 0) {
    return 0;
  }
  return answer ? Math.abs(answer) : undefined;
}


const isMobile = ref(window.innerWidth < 768);

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    isTimeVisibleTotalR.value = true;
    isTimeVisibleFirstR.value = true;
  }
};

onMounted(() => {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});

const dynamicTag = computed(() => (isMobile.value ? "h5" : "h2"));

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
    minmax(20px, 20px) /* index */
    minmax(20px, 15px) /* A */
    minmax(5px, 5px)   /* +- */
    minmax(20px, 15px) /* B */
    minmax(5px, 5px)  /* = */
    minmax(5px, 3px)  /* - */
    minmax(40px,60px) /* answer */
    minmax(40px, 50px) /* times1 */
    minmax(3px, 5px) /* sep */
    minmax(40px, 50px) /* times2 */
    ;
  gap: 2px;
  align-items: center;
}

.calculation-content-no-time {
    display: grid;
    grid-template-columns:
    minmax(10px, 20px) /* index */
    minmax(10px, 15px) /* A */
    minmax(5px, 5px)   /* +- */
    minmax(10px, 15px) /* B */
    minmax(5px, 5px)  /* = */
    minmax(3px, 3px)  /* - */
    minmax(35px,40px) /* answer */
;
    gap: 2px;
    align-items: center;
}

.calculation-id {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.5;
}

.calculation-part {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calculation-part-time1 {
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calculation-part-sep {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calculation-part-time2 {
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
