<template>
  <v-card>
    <AnimeSprite :show-source-link="true" />
    <AnimeSprite :show-source-link="false" :transform-scale="0.5" :transform-origin="`bottom right`" :speed="5"/>
  </v-card>


  <PuzzleImage
    ref="puzzleRef"
    :param_numberOfHiddenPieces="65"
    param_imagesUrl="https://kosmonautix.cz/wp-content/uploads/2022/03/1094599-1024x640.jpg"
    :param_maxHeight="500"
    :param_maxWidth="500"
  />
  <v-btn @click="revealNextPiece">Next</v-btn>

  <EmojiStatusTest/>

</template>

<script setup lang="ts">
import AnimeSprite from "@/components/playground/AnimeSprite.vue";
import { ref } from 'vue'
import PuzzleImage from '@/components/PuzzleImage.vue'
import EmojiStatusTest from '@/components/game_components/EmojiStatusTest.vue'

const puzzleRef = ref();

const revealNextPiece = () => {
  puzzleRef.value?.next();
};

</script>

<style scoped>
.v-card {
  margin: 10px;
  padding: 10px;
}
</style>