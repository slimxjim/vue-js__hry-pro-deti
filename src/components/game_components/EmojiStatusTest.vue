
<template>
  <VContainer>
    <VRow justify="center">
      <EmojiStatus :correct="correct" :incorrect="incorrect" />
    </VRow>
    <VRow>
      <VCol cols="6">
        <VTextField v-model.number="correct" label="Correct Answers" type="number" min="0" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model.number="incorrect" label="Incorrect Answers" type="number" min="0" />
      </VCol>
    </VRow>
  </VContainer>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { VTextField, VContainer, VRow, VCol } from 'vuetify/components';
import EmojiStatus from '@/components/game_components/EmojiStatus.vue'

const correct = ref(0);
const incorrect = ref(0);
</script>
