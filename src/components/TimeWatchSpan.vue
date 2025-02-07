<template>
  <span class="seconds">{{ formattedSeconds }}s</span>
  <span class="milliseconds">{{ formattedMilliseconds }}ms</span>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { GcTime } from '@/types/GcTime';

const props = defineProps<{
  time: GcTime;
}>();

// Upraví sekundy na 2 číslice (např. 05, 12)
const formattedSeconds = computed(() => props.time.seconds.toString().padStart(1, '0'));

// Upraví milisekundy na 3 číslice (např. 007, 045, 120)
const formattedMilliseconds = computed(() => props.time.milliseconds.toString().padStart(3, '0'));
</script>

<style scoped>
.seconds {
    display: inline-block;
    width: 4ch; /* Rezervuje místo na 2 číslice + 1 znak */
    text-align: right;
    margin-right: 0.1em;
}

.milliseconds {
    display: inline-block;
    width: 6ch; /* Rezervuje místo na 3 číslice + 1 znak */
    text-align: right;
    opacity: 50%;
    font-size: 60%;
}
</style>
