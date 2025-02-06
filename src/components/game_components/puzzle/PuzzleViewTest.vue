<template>
  <v-card>

    <v-btn small color="gray" @click="preparePuzzle()" @keydown.prevent>SetPuzzle</v-btn>
    <v-btn small color="gray" @click="revealNext()" @keydown.prevent>RevealNext</v-btn>
    <v-btn small color="gray" @click="hideNext()" @keydown.prevent>HideNext</v-btn>
    <v-text-field v-model="countPieces" label="Počet políček" type="number" min="0" step="1"/>

    <GcPuzzle
      :puzzle-image-model=puzzleImageModel
      :param_max-height="500"
      :param_max-width="500"/>
    <PuzzleImageGridIlustration :puzzle-image-model="puzzleImageModel" />
  </v-card>
</template>

<script setup lang="ts">
import GcPuzzle from '@/components/game_components/puzzle/GcPuzzle.vue'
import { usePuzzleImage } from '@/composable/usePuzzle'
import { onMounted, ref } from 'vue'
import PuzzleImageGridIlustration from '@/components/game_components/puzzle/PuzzleImageGridIlustration.vue'
import { ImageUtils } from '@/utils/ImageUtils'

const usePuzzle = usePuzzleImage();
const puzzleImageModel = usePuzzle.puzzleImageModel;
const countPieces = ref<number>(1);

onMounted(() => {
  preparePuzzle();
});

const imageUrl = "https://kosmonautix.cz/wp-content/uploads/2022/03/1094599-1024x640.jpg";
let heightPx = 0;
let widthPx = 0;
ImageUtils.getImageDimensions(imageUrl)
  .then(dimensions => {
    heightPx = dimensions.height;
    widthPx = dimensions.width;
    console.log(`Šířka: ${dimensions.width}px, Výška: ${dimensions.height}px`);
  })
  .catch(error => {
    console.log(error);
  });

function preparePuzzle() {
  usePuzzle.createPuzzle(imageUrl, widthPx, heightPx, countPieces.value);
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