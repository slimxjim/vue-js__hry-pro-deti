<template>
  <v-card>
    <v-form v-if="!isLoggedIn" @submit.prevent="submitLogin">
      <v-text-field label="Email" v-model="email" />
      <v-text-field label="Heslo" v-model="password" type="password" />
      <v-btn type="submit">Přihlásit</v-btn>
    </v-form>
    <v-btn v-if="isLoggedIn" @click="logout">Odhlásit</v-btn>
  </v-card>
  <br/>
  <v-card>
    <RegisterPlayer/>
    <LoginPlayer/>
  </v-card>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import LoginPlayer from '@/views/LoginPlayer.vue'
import RegisterPlayer from '@/views/RegisterPlayer.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();

// Reaktivní stav dialogu
const dialogVisible = ref(false);

// Reaktivní sledování stavu přihlášení a uživatele
const isLoggedIn = computed(() => authStore.isLoggedIn); // Dynamický stav

// Reaktivní vstupy pro přihlašovací formulář
const email = ref('');
const password = ref('');

// Funkce pro odhlášení
const logout = () => {
  authStore.logoutUser();
};

// Funkce pro odeslání přihlašovacích údajů
const submitLogin = async () => {
  if (!email.value || !password.value) {
    alert('Vyplňte všechna povinná pole.');
    return;
  }

  try {
    // Simulace přihlášení
    const user = { email: email.value }; // Zde volání API
    await authStore.loginUser(email.value, password.value);

    dialogVisible.value = false; // Zavřít dialog po úspěšném přihlášení
  } catch (error) {
    alert('Chyba při přihlašování.');
  }
};
</script>
