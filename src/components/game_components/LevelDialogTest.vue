<template>
  <v-container>
    <v-btn @click="openDialog">Set Level</v-btn>
    <v-btn @click="clearLevel" color="red">Delete Level</v-btn>
    <LevelDialog ref="dialogRef" />
    <div v-if="level">
      <h3>Current Level:</h3>
      <p>{{ level.Name }}</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLevelStore } from '@/stores/useLevelStore';
import LevelDialog from '@/components/game_components/LevelDialog.vue'
import Cookies from 'js-cookie'

const dialogRef = ref<InstanceType<typeof LevelDialog> | null>(null);
const store = useLevelStore();
const level = computed(() => store.level);

function openDialog() {
  if (dialogRef.value) {
    dialogRef.value.isOpen = true; // ✅ Otevře dialog
  }
}

function clearLevel() {
  store.setLevel(null);
  Cookies.remove('calculationLevel');
}
</script>
