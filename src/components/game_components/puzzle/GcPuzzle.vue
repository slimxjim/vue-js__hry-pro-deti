<template>
  <v-card class="card-player">
    <div class="puzzle">
      <div class="puzzle-container">
        <img
          :src="puzzleImageModel?.imageUrl ?? 'notFound'"
          alt="puzzle"
          class="puzzle-image"
        />
        <div class="overlay-grid">
          <div
            v-for="(row, rowIndex) in revealedState"
            :key="rowIndex"
            class="grid-row"
          >
            <div
              v-for="(isRevealed, colIndex) in row"
              :key="colIndex"
              class="grid-cell"
              :class="{ revealed: isRevealed }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
  <PuzzleImageGridIlustration :puzzle-image-model="puzzleImageModel" />
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import type { PuzzleImageModel } from '@/types/puzzelTypes'
import PuzzleImageGridIlustration from '@/components/game_components/puzzle/PuzzleImageGridIlustration.vue'

// Props
const props = defineProps<{
  puzzleImageModel: PuzzleImageModel | undefined;
  param_maxHeight: number;
  param_maxWidth: number;
}>();

// Definovaná matice odkrytých oblastí (3x3)
const revealedState = computed(() => props.puzzleImageModel?.revealedState.getMatrix());
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

/* Mřížka překrytí */
.overlay-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Každý řádek mřížky */
.grid-row {
    display: flex;
    flex-grow: 1; /* Každý řádek zabírá stejnou výšku */
}

/* Každá buňka */
.grid-cell {
    flex-grow: 1; /* Dynamická šířka buněk */
    width: 100%; /* Každá buňka se roztáhne do šířky */
    height: 100%;
    background-color: red;
    opacity: 0.7;
    border: 1px solid white;
}

/* Odkryté části */
.grid-cell.revealed {
    opacity: 0;
}
</style>
