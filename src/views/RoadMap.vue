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

        <!-- https://pictogrammers.com/library/mdi/icon/database/ -->
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
              prepend-icon="mdi-school"
              title="Sčítání odečítání - UČENÍ"
              value="scitani-odecitani-uceni"
              router to="/scitani-odecitani-uceni"
          ></v-list-item>
          <v-list-item
              prepend-icon="mdi-numeric"
              title="Sčítání odečítání"
              value="scitani-odecitani"
              router to="/scitani-odecitani"
          ></v-list-item>
          <v-list-item
              prepend-icon="mdi-apple-keyboard-control"
              title="Rozklad"
              value="rozklad"
              router to="/rozklad"
          ></v-list-item>
          <v-list-item
              prepend-icon="mdi-multimedia"
              title="Animace - hřiště"
              value="animace"
              router to="/animation-playground"
          ></v-list-item>
          <v-list-item
              v-if="isLoggedIn && loggedUser?.username === 'admin'"
              prepend-icon="mdi-database "
              title="CRUD Test"
              value="crud-test"
              router to="/crud-test"
          ></v-list-item>
        </v-list>


        <div v-if="!rail">
          <v-divider>User</v-divider>
          <v-card v-if="isLoggedIn">
            <pre v-html="JSON.stringify(loggedUser, null, 2)"></pre>
          </v-card>
          <LoginUserFlow/>
        </div>

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
import { computed, ref } from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import { useAuthStore } from '@/stores/auth'
import LoginUserFlow from '@/components/user_management/LoginUserFlow.vue'

const avatarPath = `${import.meta.env.BASE_URL}images/bird.jpeg`;
const drawer = ref(true)
const rail = ref(true)

// user login auth part
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn); // Dynamický stav
const loggedUser = computed(() => authStore.user); // Dynamický stav

</script>
