<template>
  <RoadMap/>
<!--  <TestLogin/>-->
<!--  <ScitaniOdecitani/>-->
</template>

<script setup lang="ts">
import {ref} from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import RoadMap from "@/views/RoadMap.vue";
import ScitaniOdecitani from "@/views/ScitaniOdecitani.vue";
import TestLogin from '@/views/TestLogin.vue'
const avatarPath = `${import.meta.env.BASE_URL}images/bird.jpeg`;
const drawer = ref(true)
const rail = ref(false)
</script>
