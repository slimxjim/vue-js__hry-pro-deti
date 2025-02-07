<template>
  <div @click="removeButtonFocus">
    <v-form>
      <v-btn small @click="(event: MouseEvent) => { startGame(); (event.target as HTMLElement).blur(); }" @keydown.prevent>Start/Pause Game</v-btn>
      <v-btn small @click="stopGame" @keydown.prevent>Stop Game</v-btn>
      <v-btn small color="gray" @click="doResetGame" @keydown.prevent>Reset</v-btn>
      <v-btn small color="gray" @click="changeLevel" @keydown.prevent>Change level</v-btn>
      <v-btn small color="gray" @click="doAnswer" @keydown.prevent>answer</v-btn>
      <v-btn small color="gray" @click="doSkipAnswer" @keydown.prevent>nevím</v-btn>
      |
      <v-btn small color="gray" @click="stopWatch.start()" @keydown.prevent>Start ms</v-btn>
      <v-btn small color="gray" @click="stopWatch.stop()" @keydown.prevent>Stop ms</v-btn>
      <v-btn small color="gray" @click="startAnswering" @keydown.prevent>Answering</v-btn>
    </v-form>
    <div v-if="gameStore.isGameActive">
      <v-row>
        <v-col>Game in progress...{{ game?.gameState.gameProgress }} -> {{ game?.gameState.currentTurnIndexInGameScenario }} -> Level {{ game?.level.LevelID }}</v-col>
        <v-col>Time = <TimeWatchSpan :time="gameStore.turnTimeFirst"/></v-col><v-col><TimeWatchSpan :time="gameStore.turnTimeTotal"/></v-col>
      </v-row>
    </div>
  </div>
</template>
<script setup lang="ts">

import type { useGameStore } from '@/stores/useGameStore'

const props = defineProps<{
  removeButtonFocus: () => void;
  startGame: () => void;
  stopGame: () => void;
  doResetGame: () => void;
  changeLevel: () => void;
  doAnswer: () => void;
  doSkipAnswer: () => void;
  startMs: () => void;
  stopMs: () => void;
  startAnswering: () => void;
  gameStore: ReturnType<typeof useGameStore>;
  stopWatch: ReturnType<typeof useStopwatchGlobalStore>;
  game: GameCalculation | null;
}>();

import TimeWatchSpan from '@/components/TimeWatchSpan.vue'
import type { GameCalculation } from '@/types/calculationTypes'
import { useStopwatchGlobalStore } from '@/stores/useStopwatchGlobalStore'
</script>


<style scoped>

</style>