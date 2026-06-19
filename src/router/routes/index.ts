import type { RouteRecordRaw } from 'vue-router'
import { RoutesNames } from '../contants'

import HomePage from '@/pages/HomePage.vue'

export const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    name: RoutesNames.Home,
    component: HomePage,
  },
]
