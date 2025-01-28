<template>
  <v-container class="pa-4">
    <v-card class="pa-2" max-width="600">
      <v-card-title class="text-h6">Test UsedExamples REST API - nefunguje update</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Operand A"
                v-model.number="calculationData.OperandA"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Operator"
                v-model="calculationData.Operator"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Operand B"
                v-model.number="calculationData.OperandB"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Correct Answer"
                v-model.number="calculationData.CorrectAnswer"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center" class="mt-3">
          <v-btn small color="primary" @click="createExample">Create</v-btn>
          <v-btn small color="info" @click="fetchExamples">Fetch All</v-btn>
          <v-btn small color="warning" @click="updateExample">Update</v-btn>
          <v-btn small color="error" @click="deleteExample">Delete</v-btn>
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
const calculationData = ref({
  OperandA: 0,
  Operator: "+",
  OperandB: 0,
  CorrectAnswer: 0,
});

const response = ref<any>(null);
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/used_calculations.php';
// const API_BASE_URL = "http://localhost/vue_game_api/used_calculations.php";

// Reset form
const resetForm = () => {
  calculationData.value = {
    OperandA: 0,
    Operator: "+",
    OperandB: 0,
    CorrectAnswer: 0,
  };
  response.value = null;
};

// Create calculation
const createExample = async () => {
  try {
    const res = await axios.post(API_BASE_URL, calculationData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch calculations
const fetchExamples = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Update calculation
const updateExample = async () => {
  try {
    const id = prompt("Enter the ExampleID to update:");
    if (!id) return;
    const res = await axios.put(`${API_BASE_URL}?id=${id}`, calculationData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Delete calculation
const deleteExample = async () => {
  try {
    const id = prompt("Enter the ExampleID to delete:");
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
