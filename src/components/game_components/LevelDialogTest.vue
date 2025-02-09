<template>
  <v-container>
    <v-row>
      <v-col><v-btn @click="openDialog">Set Level</v-btn></v-col>
      <v-col v-if="level"><span style="text-wrap: nowrap">Level: {{ level.Name }}</span></v-col>
    </v-row>


    <LevelDialog ref="dialogRef" />

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLevelStore } from '@/stores/useLevelStore';
import LevelDialog from '@/components/game_components/LevelDialog.vue'

const dialogRef = ref<InstanceType<typeof LevelDialog> | null>(null);
const store = useLevelStore();
const level = computed(() => store.level);

function openDialog() {
  if (dialogRef.value) {
    dialogRef.value.isOpen = true; // ✅ Otevře dialog
  }
}
</script>
