<template>
  <v-card>
    <AnimeSprite :show-source-link="true" />
    <AnimeSprite :show-source-link="false" :transform-scale="0.5" :transform-origin="`bottom right`" :speed="30"/>
  </v-card>
</template>

<script setup lang="ts">
import AnimeSprite from "@/components/playground/AnimeSprite.vue";
</script>

<style scoped>
.v-card {
  margin: 10px;
  padding: 10px;
}
</style>