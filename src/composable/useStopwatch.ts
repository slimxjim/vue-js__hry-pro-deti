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

export function useStopwatch() {
    const time = ref({
        seconds: 0,
        milliseconds: 0
    });

    let timer: number | null = null;
    let startTime: number | null = null;

    // Funkce pro spuštění stopek
    function start() {
        if (timer !== null) {
            console.log('Stopky už běží, nedělej nic');
            return;
        }
        console.log('Starting stopwatch');
        startTime = performance.now();
        timer = window.setInterval(() => {
            if (startTime !== null) {
                const elapsedTime = performance.now() - startTime;
                time.value.seconds = Math.floor(elapsedTime / 1000);
                time.value.milliseconds = Math.floor(elapsedTime % 1000);
            }
        }, 10); // Aktualizuje každých 10 ms
    }

    // Funkce pro zastavení stopek
    function stop(): number {
        const timeResult = timer ?? -1;
        console.log('timeResult = ',timeResult);
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
        return timeResult;
    }

    return {time, start, stop};
}

