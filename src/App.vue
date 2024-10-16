<template>
<!--  <RoadMap/>-->
  <PuzzleImage
    ref="puzzleRef"
    :param_numberOfHiddenPieces="8"
    param_imagesUrl="https://kosmonautix.cz/wp-content/uploads/2022/03/1094599-1024x640.jpg"
    :param_maxHeight="500"
    :param_maxWidth="500"
  />
    <v-btn @click="revealNextPiece">Next</v-btn>
<!--  <ScitaniOdecitani/>-->
</template>

<script setup lang="ts">
import {ref} from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import RoadMap from "@/views/RoadMap.vue";
import ScitaniOdecitani from "@/views/ScitaniOdecitani.vue";
const avatarPath = `${import.meta.env.BASE_URL}images/bird.jpeg`;
const drawer = ref(true)
const rail = ref(false)

import PuzzleImage from '@/components/PuzzleImage.vue'

const puzzleRef = ref();

const revealNextPiece = () => {
  puzzleRef.value?.next();
};
</script>
