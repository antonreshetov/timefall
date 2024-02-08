import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'records',
    component: () => import('@/views/Records.vue'),
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/Reports.vue'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
