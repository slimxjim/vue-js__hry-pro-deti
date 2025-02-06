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
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStopwatch } from '@/composable/useStopwatch'
import type { GcTime } from '@/types/GcTime'

export const useStopwatchGlobalStore = defineStore('useStopwatchGlobalStore', () => {
    const time = ref<GcTime>({
        seconds: 0,
        milliseconds: 0,
        millisecondsTotal: 0
    });

    const stopWatch = useStopwatch();

    function start() {
        stopWatch.start();
        time.value = stopWatch.time.value;
    }

    function stop() {
      stopWatch.stop();
      time.value = stopWatch.time.value;
    }

    return {time, start, stop};
});

