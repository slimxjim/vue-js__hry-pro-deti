<template>
  <v-card>

    <v-btn small color="gray" @click="preparePuzzle()" @keydown.prevent>SetPuzzle</v-btn>
    <v-btn small color="gray" @click="revealNext()" @keydown.prevent>RevealNext</v-btn>
    <v-btn small color="gray" @click="hideNext()" @keydown.prevent>HideNext</v-btn>

    <GcPuzzle
      :puzzle-image-model=puzzleImageModel
      :param_max-height="500"
      :param_max-width="500"/>
  </v-card>
</template>

<script setup lang="ts">
import GcPuzzle from '@/components/game_components/puzzle/GcPuzzle.vue'
import { usePuzzleImage } from '@/composable/usePuzzle'
import { computed, type Ref, type UnwrapRef } from 'vue'
import type { PuzzleImageModel } from '@/types/puzzelTypes'

const usePuzzle = usePuzzleImage();
const puzzleImageModel = usePuzzle.puzzleImageModel;

function preparePuzzle() {
  usePuzzle.createPuzzle(
    "https://kosmonautix.cz/wp-content/uploads/2022/03/1094599-1024x640.jpg",
    9, 3, 3
  );
  console.log('preparing puzzle: ', usePuzzle.puzzleImageModel);
}

function hideNext() {
  usePuzzle.hideNext();
}

function revealNext() {
  usePuzzle.revealNext();
}

</script>

<style scoped>

</style>