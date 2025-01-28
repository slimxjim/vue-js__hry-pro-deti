<template>
  <v-container>
    <!-- Tabs Header -->
    <v-tabs v-model="activeTab" align-tabs="center">
      <v-tab v-for="tab in tabs" :key="tab.id">{{ tab.name }}</v-tab>
    </v-tabs>

    <!-- Tabs Content -->
    <div>
      <component
        v-for="tab in tabs"
        :is="tab.component"
        v-show="activeTab === tab.id"
        :key="tab.id"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TestLevel from '@/views/crud_test/TestLevel.vue';
import TestPlayer from '@/views/crud_test/TestPlayer.vue'
import TestPlayerImages from '@/views/crud_test/TestPlayerImages.vue'
import TestGameHistory from '@/views/crud_test/TestGameHistory.vue'
import TestTurnHistory from '@/views/crud_test/TestTurnHistory.vue'
import TestUsedCalculations from '@/views/crud_test/TestUsedCalculations.vue'
import TestCalculationsStats from '@/views/crud_test/TestCalculationsStats.vue'
import TestIncorrectAnswers from '@/views/crud_test/TestIncorrectAnswers.vue'

const tabs = [
  { id: 0, name: 'Level', component: TestLevel },
  { id: 1, name: 'Player', component: TestPlayer },
  { id: 2, name: 'Player-Images', component: TestPlayerImages },
  { id: 3, name: 'Game-History', component: TestGameHistory },
  { id: 4, name: 'Turn-History', component: TestTurnHistory },
  { id: 5, name: 'Used-Calculations', component: TestUsedCalculations },
  { id: 6, name: 'Calculations-Stats', component: TestCalculationsStats },
  { id: 7, name: 'Incorrect-Answers', component: TestIncorrectAnswers },
];

const activeTab = ref(0);
</script>
