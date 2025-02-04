<template>
  <v-container class="pa-4">
    <v-card class="pa-2" max-width="600">
      <v-card-title class="text-h6">Test Players REST API</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Name"
                v-model="playerData.Name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Username"
                v-model="playerData.Username"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Password Hash"
                v-model="playerData.PasswordHash"
                type="password"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Age"
                v-model.number="playerData.Age"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Class Number"
                v-model.number="playerData.ClassNumber"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center" class="mt-3">
          <v-btn small color="primary" @click="createPlayer">Create</v-btn>
          <v-btn small color="info" @click="fetchPlayers">Fetch All</v-btn>
          <v-btn small color="gray" @click="fetchPlayer">Fetch ID</v-btn>
          <v-btn small color="warning" @click="updatePlayer">Update</v-btn>
          <v-btn small color="error" @click="deletePlayer">Delete</v-btn>
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
import { ref } from 'vue'
import axios from 'axios'


// const dbServiceLevels: DbCalculationCrudService<CalculationLevel> = new DbCalculationCrudService('/levels.php');
// console.log("Levels... ", dbServiceLevels.fetchItem(1));


// console.log('levels...', level.value);

const form = ref(null);
const playerData = ref({
  Name: "TestA",
  Username: "testa",
  PasswordHash: "admin",
  Age: 10,
  ClassNumber: 5,
});

const response = ref<any>(null);
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/players.php';
// const API_BASE_URL = "http://localhost/vue_game_api/players.php";

// Reset form
const resetForm = () => {
  playerData.value = {
    Name: "",
    Username: "",
    PasswordHash: "",
    Age: 0,
    ClassNumber: 0,
  };
  response.value = null;
};

// Create player
const createPlayer = async () => {
  try {
    const res = await axios.post(API_BASE_URL, playerData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch players
const fetchPlayers = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Update player
const updatePlayer = async () => {
  try {
    const id = prompt("Enter the PlayerID to update:");
    if (!id) return;
    const res = await axios.put(`${API_BASE_URL}?id=${id}`, playerData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch player
const fetchPlayer = async () => {
  try {
    const id = prompt("Enter the PlayerID to update:");
    if (!id) return;
    const res = await axios.get(`${API_BASE_URL}/players.php'?id=${id}`);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Delete player
const deletePlayer = async () => {
  try {
    const id = prompt("Enter the PlayerID to delete:");
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
