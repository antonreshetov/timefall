import { createApp } from 'vue'
import App from './renderer/App.vue'
import './assets/tailwind.css'
import { router } from './renderer/router'

createApp(App).use(router).mount('#app')
