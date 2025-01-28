<template>
  <v-container>
    <v-form @submit.prevent="register">
      <v-text-field
        v-model="name"
        label="Name"
        dense
        hide-details
        required
        class="mb-2"
      />
      <v-text-field
        v-model="username"
        label="Username"
        dense
        hide-details
        required
        class="mb-2"
      />
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        dense
        hide-details
        required
        class="mb-2"
      />
      <v-text-field
        v-model="age"
        label="Age"
        type="number"
        dense
        hide-details
        class="mb-2"
      />
      <v-text-field
        v-model="classNumber"
        label="Class Number"
        type="number"
        dense
        hide-details
        class="mb-2"
      />
      <v-btn type="submit" small>Register</v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const name = ref('Tom');
    const username = ref('tomas');
    const password = ref('admin');
    const age = ref<number | null>(7);
    const classNumber = ref<number | null>(2);

    const register = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/register.php';
        const response = await axios.post(API_BASE_URL, {
          name: name.value,
          username: username.value,
          password: password.value,
          age: age.value,
          classNumber: classNumber.value,
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    return {
      name,
      username,
      password,
      age,
      classNumber,
      register,
    };
  },
};
</script>

<style scoped>
.v-text-field input {
  font-size: 12px;
}

.v-btn {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
}
</style>
