<template>
  <div v-if="isLoggedIn"><strong>{{ (user as any)?.Name }}</strong> (věk: {{ (user as any)?.Age }})</div>
  <div v-else>Hráč</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn); // Dynamický stav
const user = computed(() => authStore.user);
</script>
