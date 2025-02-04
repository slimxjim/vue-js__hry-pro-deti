<template>
  <h1>About page</h1>
  {{ test }}<br>
  {{ testComposable }}
  <LoginUserFlow/>
  <p>
    computed(() => authStore.user); {{ user }}
  </p>
</template>

<script setup lang="ts">
import LoginUserFlow from '@/components/user_management/LoginUserFlow.vue'
import { computed, ref } from 'vue'
import { TimestampUtils } from '@/utils/TimestampUtils'
import { useTimestamp } from '@/composable/useTimestamp'
import { useAuthStore } from '@/stores/auth'

const test = ref(TimestampUtils.getFormatedTimestamp());
const testComposable = ref(useTimestamp().getFormatedTimestamp());

const authStore = useAuthStore();
const user = computed(() => authStore.user);





</script>
