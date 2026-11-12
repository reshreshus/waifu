import { createRouter, createWebHashHistory } from 'vue-router'

import ChatView from '@/components/ChatView.vue'
import AppSettings from '@/components/AppSettings.vue'

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: AppSettings,
    },
  ],
})

export default router