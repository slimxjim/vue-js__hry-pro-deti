<template>
  <VFadeTransition>
  </VFadeTransition>
    <VIcon :key="emojiScale" :icon="emojiScale" size="64" />
</template>
<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { VIcon, VFadeTransition } from 'vuetify/components';

const props = defineProps<{
  correct: number;
  incorrect: number }>();

const emojiScale = computed(() => {
  const total = props.correct + props.incorrect;
  if (total === 0) return 'mdi-emoticon-neutral';

  const score = Math.round((props.correct / total) * 9) + 1;
  const emojis = [
    'mdi-emoticon-dead', // 1
    'mdi-emoticon-sad',  // 2
    'mdi-emoticon-confused', // 3
    'mdi-emoticon-neutral', // 4
    'mdi-emoticon-happy', // 5
    'mdi-emoticon-excited', // 6
    'mdi-emoticon-cool', // 7
    'mdi-emoticon-lol', // 8
    'mdi-emoticon-kiss', // 9
    'mdi-emoticon-heart' // 10
  ];

  return emojis[score - 1];
});
</script>

<style scoped>

</style>