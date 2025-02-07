<template>
  <v-card
    :class="{
      'card-player': true,
      'active-player': isActivePlayer(),
      'not-active-player': !isActivePlayer()
  }">
    <div class="player">
      <component :is="dynamicTag">
        <PlayerCard />
      </component>
      <EmojiStatus
      :correct="game?.gameScenario?.length ? game?.gameScenario?.length - gameStore.getWrongAnswers().length : 0"
      :incorrect="gameStore.getWrongAnswers().length" />
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import PlayerCard from '@/components/game_components/player/PlayerCard.vue'
import { useGameStore } from '@/stores/useGameStore'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import EmojiStatus from '@/components/game_components/EmojiStatus.vue'

const gameStore = useGameStore()
const game = computed(() => gameStore.game)

function isActivePlayer(): boolean {
  return gameStore.isActivePlayer()
}

const isMobile = ref(window.innerWidth < 768);

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});

const dynamicTag = computed(() => (isMobile.value ? "h5" : "h2"));

</script>

<style scoped>
.card-player {
    display: flex;
    flex-grow: 1;
    margin: 0 3px;
    padding: 2px;
}

.active-player {
    background-color: #ccfcc9;
}

.not-active-player {

}
</style>