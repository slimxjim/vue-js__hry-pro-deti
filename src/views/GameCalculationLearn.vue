<template>

  <v-btn small @click="startGame">Start Game</v-btn>
  <v-btn small @click="stopGame">Stop Game</v-btn>
  <v-btn small color="gray" @click="changeLevel">Change level</v-btn>
  <div v-if="gameStore.isGameActive">
    <p>Game in progress...</p>
  </div>
  <v-card style="width: fit-content;">
    <CalculationList :calculations="game?.gameScenario || []" />
  </v-card>
    <v-container>
<!--      <v-card>-->
<!--        Level: <pre style="font-size: 9px">{{ initLevel }}</pre>-->
<!--      </v-card>-->
      <v-card>
        Game: <pre style="font-size: 9px">{{ game }}</pre>
      </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import CalculationList from '@/components/CalculationList.vue'

const gameStore = useGameStore();
const game =  computed(() => gameStore.game);

onMounted(async () => {
  // console.log('leaded level:', initLevel.value);
});


async function changeLevel(){
  console.log('changeLog');
  const id = prompt("Enter the LevelID to change:");
  if (!id) return;
  await gameStore.changeLevel(Number(id));
}

function startGame() {
  gameStore.startGame(1);
}

function stopGame() {
  gameStore.endGame();
}

</script>

<style scoped>
/*
p, span, div {
  font-family: Arial, sans-serif;
  text-align: center;
  font-size: 2vw;
}
h1 {
  font-size: 5vw;
}
h2 {
  font-size: 3vw;
}
h3 {
  font-size: 2vw;
}
*/
.card-player {
  display: flex;
  flex-grow: 1;
  margin: 0 3px;
  padding: 2px;
}
.active-player {
  background-color: #ccfcc9;
}
.player {
}
#question {
  margin: 20px 0;
  font-size: 20px;
}
#timer {
  color: red;
  margin: 20px 0;
  text-align: right;
  font-size: 20px;
}
.history-entry {
  margin-bottom: 0;
  font-size: 9px;
}
.history-entry span {
  display: inline-block;
}
/* Playboard má vyplňovat celý levý prostor */
.playboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playboard {
  background-color: #f5f5f5; /* Pozadí herní desky */
  padding: 5px;
  height: 100%; /* Zajistí vyplnění výšky rodičovského kontejneru */
}

/* History je zarovnaný v pravém horním rohu a roztažitelný na výšku */
.history-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Zarovná do pravého horního rohu */
  justify-content: flex-start;
  height: 100vh; /* Celá výška okna */
}

.history {
  background-color: #e0e0e0; /* Pozadí historie */
  padding: 5px;
  width: 100%; /* Roztažení na šířku */
  overflow-y: auto; /* Rolování v případě dlouhé historie */
}
.history h3 {
  font-size: 14px;
  font-weight: bold;
}

span.history-record-wrong-answer {
  /* text-decoration: line-through; */
  font-style: italic;
  color: red;
  margin: 0 !important;
}

span.history-record-correct-answer {
  color: green;
  margin: 0 !important;
}
</style>
