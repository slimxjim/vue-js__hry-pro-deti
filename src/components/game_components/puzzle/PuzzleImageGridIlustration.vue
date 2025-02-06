<template>
  <v-card>
    <h3>Revealed Puzzle Grid</h3>
    <table v-if="puzzleImageModel?.revealedState">
      <tr v-for="y in rows" :key="y">
        <td v-for="x in cols" :key="x" :style="{ backgroundColor: isRevealed(x-1, y-1) ? 'green' : 'gray', width: '20px', textAlign: 'center'}">
          {{ isRevealed(x-1, y-1) ? '1' : '0' }}
        </td>
      </tr>
    </table>

  </v-card>
</template>
<script setup lang="ts">
//Props
import type { PuzzleImageModel } from '@/types/puzzelTypes'
import { computed } from 'vue'

const props = defineProps<{
  puzzleImageModel: PuzzleImageModel | undefined;
}>();

const cols = computed(() => props.puzzleImageModel?.revealedState.maxX ?? 0);
const rows = computed(() => props.puzzleImageModel?.revealedState.maxY ?? 0);

const isRevealed = (x: number, y: number): boolean => {
  return props.puzzleImageModel?.revealedState.isRevealed(x, y) ?? false;
};
</script>

<style scoped>

</style>