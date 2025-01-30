<template>
  <v-container class="pa-4">
    <v-card class="pa-2" max-width="800">
      <v-card-title class="text-h6">CalculationsStats API</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field dense label="Player ID" v-model.number="statsData.PlayerID" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Example ID" v-model.number="statsData.ExampleID" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Best Time (ms)" v-model.number="statsData.BestTimeMs" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Worst Time (ms)" v-model.number="statsData.WorstTimeMs" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Error Rate (%)" v-model.number="statsData.ErrorRate" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Total Attempts" v-model.number="statsData.TotalAttempts" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Correct Attempts" v-model.number="statsData.CorrectAttempts" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Incorrect Attempts" v-model.number="statsData.IncorrectAttempts" type="number" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Device" v-model.number="statsData.Device" type="string" outlined></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center" class="mt-3">
          <v-btn small color="primary" @click="createStat">Create</v-btn>
          <v-btn small color="info" @click="fetchStats">Fetch All</v-btn>
          <v-btn small color="warning" @click="updateStat">Update</v-btn>
          <v-btn small color="error" @click="deleteStat">Delete</v-btn>
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

const statsData = ref({
  PlayerID: 1,
  ExampleID: 1,
  BestTimeMs: 10,
  WorstTimeMs: 1000,
  ErrorRate: 0.25, //5/20*100
  TotalAttempts: 20,
  CorrectAttempts: 5,
  IncorrectAttempts: 15,
  Device: "desktop"
});

const response = ref<any>(null);
// const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/calculations_stats.php';

// Reset form
const resetForm = () => {
  statsData.value = {
    PlayerID: 0,
    ExampleID: 0,
    BestTimeMs: 0,
    WorstTimeMs: 0,
    ErrorRate: 0,
    TotalAttempts: 0,
    CorrectAttempts: 0,
    IncorrectAttempts: 0,
    Device: "mobile"
  };
  response.value = null;
};

// Create a stat
const createStat = async () => {
  try {
    const res = await axios.post(API_BASE_URL, statsData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch stats
const fetchStats = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Update a stat
const updateStat = async () => {
  try {
    const id = prompt("Enter the StatID to update:");
    if (!id) return;
    const res = await axios.put(`${API_BASE_URL}?id=${id}`, statsData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Delete a stat
const deleteStat = async () => {
  try {
    const id = prompt("Enter the StatID to delete:");
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
