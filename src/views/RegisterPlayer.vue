<template>
  <div>
    <form @submit.prevent="register">
      <input type="text" v-model="name" placeholder="Name" required />
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <input type="number" v-model="age" placeholder="Age" />
      <input type="number" v-model="classNumber" placeholder="Class Number" />
      <button type="submit">Register</button>
    </form>
  </div>
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
