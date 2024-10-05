<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
          v-model="drawer"
          :rail="rail"
          permanent
          @click="rail = false"
      >
        <v-list-item
            :prepend-avatar="avatarPath"
            title="Hry pro děti"
            nav
        >
          <template v-slot:append>
            <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
              prepend-icon="mdi-home-city"
              title="Home"
              value="home"
              router to="/home"
          ></v-list-item>
          <v-list-item
              prepend-icon="mdi-account"
              title="About"
              value="/about"
              router to="/about"
          ></v-list-item>
          <v-list-item
              prepend-icon="mdi-numeric"
              title="Sčítání odečítání"
              value="users"
              router to="/scitani-odecitani"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>

        <RouterView />

      </v-main>
      <!--      <nav>-->
      <!--        <RouterLink to="/">Home</RouterLink>-->
      <!--        <RouterLink to="/about">About</RouterLink>-->
      <!--      </nav>-->
    </v-layout>
  </v-card>


</template>

<script setup lang="ts">
import {ref} from 'vue'
import '@mdi/font/css/materialdesignicons.css'
const avatarPath = `${import.meta.env.BASE_URL}images/bird.jpeg`;
const drawer = ref(true)
const rail = ref(true)
</script>
