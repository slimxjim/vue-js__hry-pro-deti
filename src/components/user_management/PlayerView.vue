<template>
  <div v-if="isLoggedIn"><strong>{{ user?.name }}</strong> (věk: {{ user?.age }})</div>
  <div v-else>Hráč</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn); // Dynamický stav
const user = computed(() => authStore.user);
</script>
