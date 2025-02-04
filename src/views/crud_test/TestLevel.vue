<template>
  <v-container class="pa-4">
    <v-card class="pa-2" max-width="600">
      <v-card-title class="text-h6">Test Levels REST API</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Type"
                v-model="levelData.Type"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Name"
                v-model="levelData.Name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="MinA"
                v-model.number="levelData.MinA"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="MaxA"
                v-model.number="levelData.MaxA"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Operator"
                v-model="levelData.Operator"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="MinB"
                v-model.number="levelData.MinB"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="MaxB"
                v-model.number="levelData.MaxB"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="MinResult"
                v-model.number="levelData.MinResult"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="MaxResult"
                v-model.number="levelData.MaxResult"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                dense
                label="Description"
                v-model="levelData.Description"
                outlined
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center" class="mt-3">
          <v-btn small color="primary" @click="createLevel">Create</v-btn>
          <v-btn small color="info" @click="fetchLevels">Fetch All</v-btn>
          <v-btn small color="gray" @click="fetchLevel">Fetch ID</v-btn>
          <v-btn small color="warning" @click="updateLevel">Update</v-btn>
          <v-btn small color="error" @click="deleteLevel">Delete</v-btn>
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
import { useCalculationApi } from '@/composable/useCalculationApi'

const form = ref(null);
const levelData = ref({
  Type: "",
  Name: "Level1",
  MinA: 0,
  MaxA: 5,
  Operator: "+-",
  MinB: 0,
  MaxB: 5,
  MinResult: 0,
  MaxResult: 10,
  Description: "test",
});

const response = ref<any>(null);

// const API_BASE_URL = "http://localhost/vue_game_api/levels.php";
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/levels.php';

// Reset form
const resetForm = () => {
  levelData.value = {
    Type: "",
    Name: "Level1",
    MinA: 0,
    MaxA: 5,
    Operator: "+-",
    MinB: 0,
    MaxB: 5,
    MinResult: 0,
    MaxResult: 10,
    Description: "test",
  };
  response.value = null;
};

// Create level
const createLevel = async () => {
  try {
    const res = await axios.post(API_BASE_URL, levelData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch levels
const fetchLevels = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch player
const {fetchDataById: fetchLevelId} = useCalculationApi('/levels.php');

const fetchLevel = async () => {
  try {
    const id = prompt("Enter the PlayerID to update:");
    if (!id) return;
    response.value = await fetchLevelId(Number(id));
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
  console.log('loaded level: ', response.value);
};

// Update level
const updateLevel = async () => {
  try {
    const id = prompt("Enter the LevelID to update:");
    if (!id) return;
    const res = await axios.put(`${API_BASE_URL}?id=${id}`, levelData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Delete level
const deleteLevel = async () => {
  try {
    const id = prompt("Enter the LevelID to delete:");
    if (!id) return;
    const res = await axios.delete(`${API_BASE_URL}?id=${id}`);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};
</script>

<style>
/* Kompaktní styly */
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
