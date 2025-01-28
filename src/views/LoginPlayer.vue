<template>
  <div>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const username = ref('tomas');
    const password = ref('admin');

    const login = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL + '/login.php';
        const response = await axios.post(API_BASE_URL, {
          username: username.value,
          password: password.value,
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    return {
      username,
      password,
      login,
    };
  },
};
</script>
