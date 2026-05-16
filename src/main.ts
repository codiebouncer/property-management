import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './sonner.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'

const app = createApp(App)

app.use(createPinia())
// Initialize auth store to set auth header if already logged in
const authStore = useAuthStore()
authStore.initialize()

app.use(router)

app.mount('#app')
