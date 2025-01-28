<template>
  <v-container class="pa-4">
    <v-card class="pa-2" max-width="800">
      <v-card-title class="text-h6">IncorrectAnswers API - Nefunguje Update, změn ErrorID na AnswerID</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field dense label="Player ID" v-model.number="answerData.PlayerID" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Operand A" v-model.number="answerData.OperandA" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Operator" v-model="answerData.Operator" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Operand B" v-model.number="answerData.OperandB" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Correct Answer" v-model.number="answerData.CorrectAnswer" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Player Answer" v-model.number="answerData.PlayerAnswer" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Answer Time (ms)" v-model.number="answerData.AnswerTimeMs" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Level ID" v-model.number="answerData.LevelID" type="number" outlined></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center" class="mt-3">
          <v-btn small color="primary" @click="createAnswer">Create</v-btn>
          <v-btn small color="info" @click="fetchAnswers">Fetch All</v-btn>
          <v-btn small color="warning" @click="updateAnswer">Update</v-btn>
          <v-btn small color="error" @click="deleteAnswer">Delete</v-btn>
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

const answerData = ref({
  PlayerID: 1,
  OperandA: 10,
  Operator: "+",
  OperandB: 5,
  CorrectAnswer: 15,
  PlayerAnswer: 10,
  AnswerTimeMs: 4560,
  LevelID: 3,
});

const response = ref<any>(null);
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/incorrect_answers.php';
// const API_BASE_URL = "http://localhost/vue_game_api/incorrect_answers.php";

// Reset form
const resetForm = () => {
  answerData.value = {
    PlayerID: 1,
    OperandA: 10,
    Operator: "+",
    OperandB: 5,
    CorrectAnswer: 15,
    PlayerAnswer: 10,
    AnswerTimeMs: 4560,
    LevelID: 3,
  };
  response.value = null;
};

// Create an incorrect answer
const createAnswer = async () => {
  try {
    const res = await axios.post(API_BASE_URL, answerData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch incorrect answers
const fetchAnswers = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Update an incorrect answer
const updateAnswer = async () => {
  try {
    const id = prompt("Enter the ErrorID to update:");
    if (!id) return;
    const res = await axios.put(`${API_BASE_URL}?id=${id}`, answerData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Delete an incorrect answer
const deleteAnswer = async () => {
  try {
    const id = prompt("Enter the ErrorID to delete:");
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
