<template>
  <v-card class="card-player">
    <div class="puzzle">
      <PuzzleImage
        ref="puzzleRef"
        :param_numberOfHiddenPieces="game?.gameScenario.length ?? 0"
        param_imagesUrl="https://kosmonautix.cz/wp-content/uploads/2022/03/1094599-1024x640.jpg"
        :param_maxHeight="250"
        :param_maxWidth="250"
      />
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import PlayerCard from '@/components/game_components/player/PlayerCard.vue'
import { useGameStore } from '@/stores/useGameStore'
import { computed } from 'vue'
import PuzzleImage from '@/components/PuzzleImage.vue'

const gameStore = useGameStore()
const game = computed(() => gameStore.game)

function isActivePlayer(): boolean {
  return gameStore.isActivePlayer()
}

</script>

<style scoped>
.card-player {
    display: flex;
    flex-grow: 1;
    margin: 0 3px;
    padding: 2px;
}
</style>