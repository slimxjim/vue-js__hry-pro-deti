<template>
  <div>
    <!-- Dynamické tlačítko -->
    <v-btn v-if="!isLoggedIn" @click="showLoginDialog" color="primary">Přihlásit</v-btn>
    <v-btn v-else @click="logout" color="secondary">
      Odhlásit ({{ user?.email }})
    </v-btn>

    <!-- Přihlašovací dialog -->
    <v-dialog v-model="dialogVisible" max-width="400">
      <v-card>
        <v-card-title>Přihlášení</v-card-title>
        <v-card-text>
          <v-form ref="loginForm" @submit.prevent="submitLogin">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              required
              :rules="[rules.required, rules.email]"
            />
            <v-text-field
              v-model="password"
              label="Heslo"
              type="password"
              required
              :rules="[rules.required]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="submitLogin">Přihlásit</v-btn>
          <v-btn text @click="dialogVisible = false">Zrušit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Reaktivní stav dialogu
const dialogVisible = ref(false);

// Reaktivní sledování stavu přihlášení a uživatele
const isLoggedIn = computed(() => authStore.isLoggedIn); // Dynamický stav
const user = computed(() => authStore.user);

// Reaktivní vstupy pro přihlašovací formulář
const email = ref('');
const password = ref('');

// Validace
const rules = {
  required: (value: string) => !!value || 'Toto pole je povinné',
  email: (value: string) =>
    /.+@.+\..+/.test(value) || 'Zadejte platnou emailovou adresu',
};

// Funkce pro zobrazení dialogu
const showLoginDialog = () => {
  dialogVisible.value = true;
};

// Funkce pro odhlášení
const logout = () => {
  authStore.logout();
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
    authStore.login(user);

    alert('Přihlášení úspěšné!');
    dialogVisible.value = false; // Zavřít dialog po úspěšném přihlášení
  } catch (error) {
    alert('Chyba při přihlašování.');
  }
};
</script>
