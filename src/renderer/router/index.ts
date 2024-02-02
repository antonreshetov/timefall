import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'tracking',
    component: () => import('@/views/Tracking.vue'),
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: () => import('@/views/Timeline.vue'),
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
