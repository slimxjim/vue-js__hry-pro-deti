// useStopwatch.ts
// Composables nám umožňují sdílet stav a funkce mezi více komponentami.

/*
import { useStopwatch } from '@/composables/useStopwatch';

const { start, stop } = useStopwatch();

----------------

<template>
  <div>
    <p>Čas: {{ time.seconds }}s {{ time.milliseconds }}ms</p>
  </div>
</template>

<script setup lang="ts">
import { useStopwatch } from '@/composables/useStopwatch';

const { time } = useStopwatch();
</script>


 */

// useStopwatch.ts
import {ref} from 'vue';
import type { GcTime } from '@/types/GcTime'

export function useStopwatch() {
    const time = ref<GcTime>({
        seconds: 0,
        milliseconds: 0,
        millisecondsTotal: 0
    });

    let timer: number | null = null;
    let startTime: number | null = null;
    let pauseTime: number | null = null;


      // Funkce pro spuštění stopek
      function start() {
        if (timer !== null) {
          console.log('Stopky už běží, nedělej nic');
          return;
        }
        // console.log('Starting stopwatch');
        startTime = performance.now();
        timer = window.setInterval(() => {
          if (startTime !== null) {
            const elapsedTime = performance.now() - startTime;
            time.value.seconds = Math.floor(elapsedTime / 1000);
            time.value.milliseconds = Math.floor(elapsedTime % 1000);
            time.value.millisecondsTotal = time.value.seconds * 1000 + time.value.milliseconds;
          }
        }, 10); // Aktualizuje každých 10 ms
      }

      function isRunning(): boolean {
        return timer != null && timer > 0;

      }

      // Funkce pro zastavení stopek
      function stop(): number {
        const timeResult = timer ?? -1;
        // console.log('timeResult = ',timeResult);
        if (timer !== null) {
          clearInterval(timer);
          timer = null;
        }
        return timeResult;
      }

      function stopAndClear() {
        stop();
        time.value.seconds = 0;
        time.value.milliseconds = 0;
        time.value.millisecondsTotal = 0;
      }

    // Funkce pro pozastavení stopek
    function pause() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
        pauseTime = performance.now() - (startTime ?? 0);  // Save current elapsed time for resume
        // console.log('Stopwatch paused at', pauseTime);
      }
    }

    // Funkce pro pokračování v běhu stopek po pozastavení
    function resume() {
      if (pauseTime !== null) {
        // console.log('Resuming stopwatch');
        startTime = performance.now() - (pauseTime ?? 0);  // Account for paused time
        timer = window.setInterval(() => {
          if (startTime !== null) {
            const elapsedTime = performance.now() - startTime;
            time.value.seconds = Math.floor(elapsedTime / 1000);
            time.value.milliseconds = Math.floor(elapsedTime % 1000);
            time.value.millisecondsTotal = time.value.seconds * 1000 + time.value.milliseconds;
          }
        }, 10); // Aktualizuje každých 10 ms
        pauseTime = null;  // Reset pauseTime after resuming
      }
    }

    // Funkce pro nový start s jiným useStopwatch objektem
    function newStart(newStartTime: number) {
      // console.log('Starting new stopwatch with previous time');
      // Start the new stopwatch with the time from another stopwatch
      startTime = performance.now() - newStartTime;  // Account for paused time
      timer = window.setInterval(() => {
        if (startTime !== null) {
          const elapsedTime = performance.now() - startTime;
          time.value.seconds = Math.floor(elapsedTime / 1000);
          time.value.milliseconds = Math.floor(elapsedTime % 1000);
          time.value.millisecondsTotal = time.value.seconds * 1000 + time.value.milliseconds;
        }
      }, 10); // Aktualizuje každých 10 ms
    }

    return { time, start, isRunning, stop, stopAndClear, pause, resume, newStart };
}

