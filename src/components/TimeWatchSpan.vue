<template>
  <span class="seconds">{{ time.seconds }}s</span>
  <span class="milisseconds">{{ time.milliseconds }}ms</span>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import type { GcTime } from '@/types/GcTime'

const props = defineProps<{
  time: GcTime;
}>();

</script>

<style scoped>
.seconds {
  margin-right: 0.5em;
}

.milisseconds {
    opacity: 50%;
}
</style>