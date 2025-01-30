<template>
  <v-container class="pa-4">
    <v-card class="pa-2" max-width="600">
      <v-card-title class="text-h6">Test GameHistory REST API</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Creation Timestamp"
                v-model="gameData.CreationTimestamp"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Player ID"
                v-model.number="gameData.PlayerID"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Current Turn"
                v-model="gameData.CurrentTurn"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Lives Player"
                v-model.number="gameData.LivesPlayer"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Lives Opponent"
                v-model.number="gameData.LivesOpponent"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Time Limit (Seconds)"
                v-model.number="gameData.TimeLimitSeconds"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Current Level ID"
                v-model.number="gameData.CurrentLevelID"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Last Expression"
                v-model="gameData.LastExpression"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field dense label="Device" v-model.number="gameData.Device" type="string" outlined></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center" class="mt-3">
          <v-btn small color="primary" @click="createGame">Create</v-btn>
          <v-btn small color="info" @click="fetchGames">Fetch All</v-btn>
          <v-btn small color="warning" @click="updateGame">Update</v-btn>
          <v-btn small color="error" @click="deleteGame">Delete</v-btn>
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
const gameData = ref({
  CreationTimestamp: "2025-01-28 10:22:00",
  PlayerID: 1,
  CurrentTurn: "Player",
  LivesPlayer: 3,
  LivesOpponent: 2,
  TimeLimitSeconds: 20,
  CurrentLevelID: 1,
  LastExpression: "5+10=15",
  Device: "desktop"
});

const response = ref<any>(null);
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/game_history.php';
// const API_BASE_URL = "http://localhost/vue_game_api/game_history.php";

// Reset form
const resetForm = () => {
  gameData.value = {
    CreationTimestamp: "",
    PlayerID: 1,
    CurrentTurn: "Player",
    LivesPlayer: 3,
    LivesOpponent: 3,
    TimeLimitSeconds: 60,
    CurrentLevelID: 1,
    LastExpression: "",
    Device: "mobile"
  };
  response.value = null;
};

// Create game
const createGame = async () => {
  try {
    const res = await axios.post(API_BASE_URL, gameData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch games
const fetchGames = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Update game
const updateGame = async () => {
  try {
    const id = prompt("Enter the GameID to update:");
    if (!id) return;
    const res = await axios.put(`${API_BASE_URL}?id=${id}`, gameData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Delete game
const deleteGame = async () => {
  try {
    const id = prompt("Enter the GameID to delete:");
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
