<template>
  <v-container class="pa-4">
    <v-card class="pa-2" max-width="600">
      <v-card-title class="text-h6">Test TurnHistory REST API</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Game ID"
                v-model.number="turnData.GameID"
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
                label="Answer Time (ms)"
                v-model.number="turnData.AnswerTimeMs"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center" class="mt-3">
          <v-btn small color="primary" @click="createTurn">Create</v-btn>
          <v-btn small color="info" @click="fetchTurns">Fetch All</v-btn>
          <v-btn small color="warning" @click="updateTurn">Update</v-btn>
          <v-btn small color="error" @click="deleteTurn">Delete</v-btn>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn small color="secondary" @click="resetForm">Reset</v-btn>
      </v-card-actions>
      <v-card-text>
        <pre class="text-sm">{{ response }}</pre>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const form = ref(null);
const turnData = ref({
  GameID: 1,
  OperandA: 5,
  Operator: "+",
  OperandB: 10,
  CorrectAnswer: 15,
  PlayerAnswer: 10,
  IsCorrect: true,
  AnswerTimeMs: 560,
});

const response = ref<any>(null);
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/turn_history.php';
// const API_BASE_URL = "http://localhost/vue_game_api/turn_history.php";

// Reset form
const resetForm = () => {
  turnData.value = {
    GameID: 1,
    OperandA: 0,
    Operator: "+",
    OperandB: 0,
    CorrectAnswer: 0,
    PlayerAnswer: 0,
    IsCorrect: false,
    AnswerTimeMs: 0,
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
