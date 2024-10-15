<template>
  <div>TIME = {{ time }}.</div>
  <div>
    <button @click="start">Start</button> |
    <button @click="stop">Stop</button> |
    <button @click="reset">Reset</button> |
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

// const props = defineProps<{
//   hours: boolean;
//   minutes: boolean;
// }>();

const time = ref<string>('NaN');
const isRunning = ref<boolean>(false);
const startTime = ref<number | null>(null);
const times = ref<number[]>([0, 0, 0, 0]);
const frameId = ref<number | null>(null);

const start = () => {
  if (isRunning.value) throw new Error('Stopwatch has already started.');
  isRunning.value = true;
  if (!startTime.value) startTime.value = performance.now();
  // emit('start', startTime.value);
  frameId.value = requestAnimationFrame(step);
};

const stop = () => {
  if (!isRunning.value) throw new Error('Stopwatch has not been started yet.');
  isRunning.value = false;
  startTime.value = null;
  times.value = [0, 0, 0, 0];
  // emit('stop', performance.now(), time.value);
  if (frameId.value !== null) {
    cancelAnimationFrame(frameId.value);
  }
};

const reset = () => {
  startTime.value = 0;
  isRunning.value = false;
  times.value = [0, 0, 0, 0];
  time.value = formatTimes();
};

function formatTimes(timesArray = times.value): string {
  const hours = pad0(timesArray[0], 2);
  const minutes = pad0(timesArray[1], 2);
  const seconds = pad0(timesArray[2], 2);
  const milliseconds = pad0(Math.trunc(timesArray[3] % 100), 2);

  // if (props.hours) {
  //   const ret = `${hours}:${minutes}:${seconds}:${milliseconds}`;
  //   console.log('formatTimes = ', ret);
  //   return ret;
  // }
  //
  // if (props.minutes) {
  //   const ret = `${minutes}:${seconds}:${milliseconds}`;
  //   console.log('formatTimes = ', ret);
  //   return ret;
  // }

  return `${seconds}:${milliseconds}`;
}

const pad0 = (value: number, count: number) => {
  let result = value.toString();
  while (result.length < count) {
    result = '0' + result;
    --count;
  }
  return result;
};

const step = (timestamp: number) => {
  if (!isRunning.value) return;
  calculate(timestamp);
  startTime.value = timestamp;
  time.value = formatTimes();
  frameId.value = requestAnimationFrame(step);
};

const calculate = (timestamp: number) => {
  const diff = timestamp - startTime.value!;
  times.value[3] += diff / 10;
  if (times.value[3] >= 100) {
    times.value[3] -= 100;
    times.value[2] += 1;
  }
  if (times.value[2] >= 60) {
    times.value[2] -= 60;
    times.value[1] += 1;
  }
  if (times.value[1] >= 60) {
    times.value[1] -= 60;
    times.value[0] += 1;
  }
};

// Emit function to be defined in parent component
// const emit = defineEmits(['start', 'stop']);
// defineExpose({ start, stop })

</script>
