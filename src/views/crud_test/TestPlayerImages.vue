<template>
  <v-container class="pa-4">
    <v-card class="pa-2" max-width="600">
      <v-card-title class="text-h6">Test PlayerImages REST API</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Player ID"
                v-model.number="imageData.PlayerID"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Upload Date"
                v-model="imageData.UploadDate"
                type="datetime-local"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                label="Image URL"
                v-model="imageData.ImageURL"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Last Used Date"
                v-model="imageData.LastUsedDate"
                type="datetime-local"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Reveal Percentage"
                v-model.number="imageData.RevealPercentage"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                label="Usage Count"
                v-model.number="imageData.UsageCount"
                type="number"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center" class="mt-3">
          <v-btn small color="primary" @click="createImage">Create</v-btn>
          <v-btn small color="info" @click="fetchImages">Fetch All</v-btn>
          <v-btn small color="warning" @click="updateImage">Update</v-btn>
          <v-btn small color="error" @click="deleteImage">Delete</v-btn>
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
const imageData = ref({
  PlayerID: 1,
  UploadDate: "2025-01-28 10:22:00",
  ImageURL: "https://vedanadosah.cvtisr.sk/wp-content/uploads/importovane/img/articles/k9tFpUql.jpg",
  LastUsedDate: "2025-01-28 10:22:00",
  RevealPercentage: 0.05,
  UsageCount: 1,
});

const response = ref<any>(null);
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/player_images.php';
// const API_BASE_URL = "http://localhost/vue_game_api/player_images.php";

// Reset form
const resetForm = () => {
  imageData.value = {
    PlayerID: 0,
    UploadDate: "",
    ImageURL: "",
    LastUsedDate: "",
    RevealPercentage: 0.00,
    UsageCount: 0,
  };
  response.value = null;
};

// Create player image
const createImage = async () => {
  try {
    const res = await axios.post(API_BASE_URL, imageData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Fetch player images
const fetchImages = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Update player image
const updateImage = async () => {
  try {
    const id = prompt("Enter the ImageID to update:");
    if (!id) return;
    const res = await axios.put(`${API_BASE_URL}?id=${id}`, imageData.value);
    response.value = res.data;
  } catch (err: any) {
    response.value = err.response?.data || err.message;
  }
};

// Delete player image
const deleteImage = async () => {
  try {
    const id = prompt("Enter the ImageID to delete:");
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
