<template>
  <v-container class="pa-4">
    <v-card class="pa-2" max-width="600">
      <v-card-title class="text-h6">Test TurnHistory REST API</v-card-title>
      <v-card-text>
        <AnswerStats :data="getAnswerData()"/>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Player ID"
                v-model.number="turnData.PlayerID"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Level ID"
                v-model.number="turnData.LevelID"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Operand A"
                v-model.number="turnData.OperandA"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Operator"
                v-model="turnData.Operator"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Operand B"
                v-model.number="turnData.OperandB"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Correct Answer"
                v-model.number="turnData.CorrectAnswer"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Player Answer"
                v-model.number="turnData.PlayerAnswer"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-checkbox
                label="Is Correct"
                v-model="turnData.IsCorrect"
                dense
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Answer Time First (ms)"
                v-model.number="turnData.AnswerTimeFirstMs"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Answer Time Total (ms)"
                v-model.number="turnData.AnswerTimeTotalMs"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Device" v-model.number="turnData.Device" type="string" outlined></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center" class="mt-3">
          <v-btn small color="primary" @click="createTurn">Create</v-btn>
          <v-btn small color="info" @click="fetchTurns">Fetch All</v-btn>
          <v-btn small color="gray" @click="fetchByPlayerId">Fetch ID</v-btn>
          <v-btn small color="warning" @click="updateTurn">Update</v-btn>
          <v-btn small color="error" @click="deleteTurn">Delete</v-btn>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn small color="secondary" @click="resetForm">Reset</v-btn>
      </v-card-actions>
      <v-card-text>
        <pre style="font-size: 10px; scroll-behavior: smooth" class="text-sm">{{ response }}</pre>
      </v-card-text>
    </v-card>
  </v-container>

</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import AnswerStats from '@/components/game_components/AnswerStats.vue'
import type { AnswerData } from '@/types/calculationTypes'

const form = ref(null);
const turnData = ref({
  PlayerID: 1,
  LevelID: 1,
  OperandA: 5,
  Operator: "+",
  OperandB: 10,
  CorrectAnswer: 15,
  PlayerAnswer: 10,
  IsCorrect: true,
  AnswerTimeFirstMs: 560,
  AnswerTimeTotalMs: 1560,
  Device: "desktop"
});

const response = ref<any>(null);
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/turn_history.php';
// const API_BASE_URL = "http://localhost/vue_game_api/turn_history.php";

// Reset form
const resetForm = () => {
  turnData.value = {
    PlayerID: 1,
    LevelID: 1,
    OperandA: 0,
    Operator: "+",
    OperandB: 0,
    CorrectAnswer: 0,
    PlayerAnswer: 0,
    IsCorrect: false,
    AnswerTimeFirstMs: 0,
    AnswerTimeTotalMs: 0,
    Device: "mobile"
  };
  response.value = null;
};

// Create turn
const createTurn = async () => {
  try {
    const res = await axios.post(API_BASE_URL, turnData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch turns
const fetchTurns = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    response.value = res.data;
    getAnswerData();
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch player
const fetchByPlayerId = async () => {
  try {
    const id = prompt("Enter the PlayerID to update:");
    if (!id) return;
    const res = await axios.get(`${API_BASE_URL}?playerId=${id}`);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Update turn
const updateTurn = async () => {
  try {
    const id = prompt("Enter the TurnID to update:");
    if (!id) return;
    const res = await axios.put(`${API_BASE_URL}?id=${id}`, turnData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Delete turn
const deleteTurn = async () => {
  try {
    const id = prompt("Enter the TurnID to delete:");
    if (!id) return;
    const res = await axios.delete(`${API_BASE_URL}?id=${id}`);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

function getAnswerData(): AnswerData[] {
  if (!response.value) {
    return [];
  }

  const parsedData = response.value;//JSON.parse(response.value);
  const answerData: AnswerData[] = [];

  for (let i = 0; i < parsedData.length; i++) {
    const item = parsedData[i];
    if (item.PlayerAnswer == null) {
      continue;
    }
    answerData.push({
      ErrorID: item.ErrorID,
      PlayerID: item.PlayerID,
      OperandA: item.OperandA,
      Operator: item.Operator,
      OperandB: item.OperandB,
      CorrectAnswer: item.CorrectAnswer,
      PlayerAnswer: item.PlayerAnswer !== null ? item.PlayerAnswer : null,
      AnswerTimeMs: item.AnswerTimeFirstMs,
      LevelID: item.LevelID,
      Device: item.Device ?? null,
    });
  }

  console.log("AnswerData[] = ", answerData);
  return answerData;
}



</script>

<style>
/* Compact styles */
.v-card {
  font-size: 14px;
}

.v-text-field,
.v-textarea {
  min-height: 36px;
  font-size: 14px;
}

.v-btn {
  font-size: 12px;
  height: 32px;
}
</style>
