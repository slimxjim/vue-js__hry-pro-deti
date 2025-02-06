<template>
  <v-card class="card-player">
    <div class="puzzle">
      <div class="puzzle-container">
        <img
          :src="puzzleImageModel?.imageUrl ?? 'notFound'"
          alt="puzzle"
          class="puzzle-image"
        />
      </div>
    </div>
  </v-card>
  <v-card style="font-size: 8px">
    {{ puzzleImageModel }} | {{ puzzleImageModel?.imageUrl}} | {{ puzzleImageModel?.revealedState.printToConsole() }}
  </v-card>
  <PuzzleImageGridIlustration :puzzle-image-model="puzzleImageModel" />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import type { PuzzleImageModel } from '@/types/puzzelTypes'
import PuzzleImageGridIlustration from '@/components/game_components/puzzle/PuzzleImageGridIlustration.vue'

// Props
const props = defineProps<{
  puzzleImageModel: PuzzleImageModel | undefined;
  param_maxHeight: number;
  param_maxWidth: number;
}>();
</script>

<style scoped>
.card-player {
    display: flex;
    flex-grow: 1;
    margin: 0 3px;
    padding: 2px;
}

.puzzle-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: v-bind(param_maxWidth + 'px');
    max-height: v-bind(param_maxHeight + 'px');
    overflow: hidden;
}

.puzzle-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
</style>
