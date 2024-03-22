import { createApp } from 'vue'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import App from './renderer/App.vue'
import './assets/tailwind.css'
import './assets/vendor.css'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { router } from './renderer/router'

createApp(App).use(router).use(PerfectScrollbar).mount('#app')
