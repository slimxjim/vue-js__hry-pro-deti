<template>
  <v-container class="compact-container">
    <v-table density="compact">
      <thead>
      <tr>
        <th>Example</th>
        <th>✔️ Correct</th>
        <th>Best Time</th>
        <th>❌ Incorrect</th>
        <th>Best Time</th>
        <th>Details</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(group, key) in groupedData" :key="key">
        <tr @click="toggleExpand(key)" class="cursor-pointer group-row">
          <td class="bold-text">
            {{ group.operandA }} {{ group.operator }} {{ group.operandB }} = {{ group.correctAnswer }}
          </td>
          <td>{{ group.correctCount }}</td>
          <td>{{ formatTime(group.bestCorrectTime) }}</td>
          <td>{{ group.incorrectCount }}</td>
          <td>{{ formatTime(group.bestIncorrectTime) }}</td>
          <td>{{ expandedRows[key] ? '-' : '+' }}</td>
        </tr>
        <tr v-if="expandedRows[key]" class="details-row" >
          <td colspan="6">
            <v-table density="compact">
              <thead>
              <tr>
                <th>Player</th>
                <th>Answer</th>
                <th>Time</th>
                <th>Level</th>
                <th>Device</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in group.details" :key="item.ErrorID" :style="[item.PlayerAnswer !== item.CorrectAnswer ? 'background-color: #E38585FF' : 'background-color: #B7FCA9FF']">
                <td>{{ item.PlayerID }}</td>
                <td>{{ item.PlayerAnswer ?? 'N/A' }}</td>
                <td>{{ formatTime(item.AnswerTimeMs) }}</td>
                <td>{{ item.LevelID }}</td>
                <td>{{ item.Device ?? 'Unknown' }}</td>
              </tr>
              </tbody>
            </v-table>
          </td>
        </tr>
      </template>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { AnswerData } from '@/types/calculationTypes'

const props = defineProps<{ data: AnswerData[] }>();
const expandedRows = ref<Record<string, boolean>>({});

const groupedData = computed(() => {
  const grouped: Record<string, any> = {};

  for (const item of props.data) {
    const key = `${item.OperandA}_${item.Operator}_${item.OperandB}`;
    if (!grouped[key]) {
      grouped[key] = {
        operandA: item.OperandA,
        operator: item.Operator,
        operandB: item.OperandB,
        correctAnswer: item.CorrectAnswer,
        correctCount: 0,
        incorrectCount: 0,
        bestCorrectTime: Infinity,
        bestIncorrectTime: Infinity,
        details: []
      };
    }

    grouped[key].details.push(item);

    if (item.PlayerAnswer === item.CorrectAnswer) {
      grouped[key].correctCount++;
      if (item.AnswerTimeMs < grouped[key].bestCorrectTime) {
        grouped[key].bestCorrectTime = item.AnswerTimeMs;
      }
    } else {
      grouped[key].incorrectCount++;
      if (item.AnswerTimeMs < grouped[key].bestIncorrectTime) {
        grouped[key].bestIncorrectTime = item.AnswerTimeMs;
      }
    }
  }

  return grouped;
});

const toggleExpand = (key: string) => {
  expandedRows.value[key] = !expandedRows.value[key];
};

const formatTime = (ms: number) => {
  if (!ms || ms === Infinity) return "N/A";
  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;
  return `${seconds}s ${milliseconds}ms`;
};
</script>

<style scoped>
.compact-container {
    padding: 8px;
}

.v-table {
    font-size: 10px;
}

th {
    font-size: 14px;
    font-weight: bold;
    padding: 4px 6px;
}

td {
    font-size: 10px;
    padding: 2px 4px;
}

.group-row {
    font-weight: bold;
    background: #f5f5f5;
}

.group-row:hover {
    background: #e0e0e0;
}

.details-row {
    background: #fafafa;
}

.bold-text {
    font-weight: bold;
}

.cursor-pointer {
    cursor: pointer;
}
</style>
