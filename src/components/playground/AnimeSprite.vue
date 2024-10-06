<template>
  <div v-if="props.showSourceLink">
    Zdroj: <a href="https://vueschool.io/articles/vuejs-tutorials/how-to-create-an-animated-sprite-with-vueuse/">
    https://vueschool.io/articles/vuejs-tutorials/how-to-create-an-animated-sprite-with-vueuse/
    </a>
  </div>

  <!-- Div to display the sprite -->
  <div
      class="sprite"
      :style="{
        backgroundImage: `url(${baseUrl}images/sprite.png)`,
        backgroundPosition: activePosition + 'px 50%',
        transform: `scale(${transformScale})`,
        transformOrigin: `${transformOrigin}`,
      }"
  />
  <input type="range" step="20" min="0" max="200" v-model="speed" /> {{ speed }}
  <!-- Tlačítko pro pauzování nebo spuštění animace -->
  <v-btn @click="togglePause">{{ isPaused ? 'Spustit' : 'Zastavit' }} animaci</v-btn>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'; //npm i @vueuse/core
import {defineProps, ref, watch} from "vue";

const props = withDefaults(
    defineProps<{
      showSourceLink?: boolean;
      transformScale?: number;
      transformOrigin?: string;
      speed?: number;
    }>(),
    {
      speed: 100, // Výchozí hodnota pro 'speed'
    }
);

const baseUrl = import.meta.env.BASE_URL;
const activePosition = ref(0);
const isPaused = ref(false);

const speed = ref(props.speed);

const { pause, resume, isActive } = useIntervalFn(() => {
  if (activePosition.value > -525) {
    activePosition.value -= 75;
  } else {
    activePosition.value = 0;
  }
}, speed, {immediate: true});

// Funkce pro přepnutí pauzy a spuštění animace
const togglePause = () => {
  if (isPaused.value) {
    resume();
  } else {
    pause();
  }
  isPaused.value = !isPaused.value;
};
</script>

<style scoped>
.sprite {
  /* Display the image */
  background: url(https://freesvg.org/img/1525205509.png) no-repeat; /* not needed, overwriten in <template> because of baseUrl is different in production */
  /* each frame is 75px wide so limit container to display one at a time */
  width: 75px;
  /* main is roughly 150px tall */
  height: 150px;
  /* the image has some space on top and bottom so this accounts for that */
  background-position: 0px 50%;
  transform: scale(1);
  transform-origin: center;
}
/*
input[type='range'] {
  transform: scaleX(-1);
}
 */
</style>