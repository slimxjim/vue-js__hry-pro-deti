<template>
  <div>
    <v-btn v-if="!isLoggedIn" @click="showLoginDialog">Přihlásit</v-btn>
    <v-btn v-else @click="handleLogout">
      Odhlásit ({{ user?.name }})
    </v-btn>

    <v-dialog v-model="dialogVisible" max-width="400">
      <v-card>
        <v-card-title>Přihlášení</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitLogin">
            <v-text-field v-model="email" label="Email" required />
            <v-text-field v-model="password" label="Heslo" type="password" required />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="submitLogin">Přihlásit</v-btn>
          <v-btn @click="dialogVisible = false">Zrušit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { isLoggedIn, user, loginUser, logoutUser } = authStore;

const dialogVisible = ref(false);
const email = ref('');
const password = ref('');

const showLoginDialog = () => {
  dialogVisible.value = true;
};

const submitLogin = async () => {
  try {
    await loginUser(email.value, password.value);
    dialogVisible.value = false; // Zavřít dialog
  } catch (error: any) {
    alert(error.message);
  }
};

const handleLogout = async () => {
  await logoutUser();
};
</script>
