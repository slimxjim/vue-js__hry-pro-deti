import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
})

const pinia = createPinia();

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(pinia);

// Obnovit stav přihlášení
const authStore = useAuthStore();
authStore.restoreSession();

app.mount('#app')
