import type { RouteRecordRaw } from 'vue-router'
import { RoutesNames } from '../contants'

import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import MazeGenerationPage from '@/pages/MazeGenerationPage.vue'

export const makeRoutes = (): readonly RouteRecordRaw[] => {
  return [
    {
      path: '/',
      name: RoutesNames.Home,
      component: HomePage,
    },
    {
      path: '/about',
      name: RoutesNames.About,
      component: AboutPage,
    },
    {
      path: '/maze-generation',
      name: RoutesNames.MazeGeneration,
      component: MazeGenerationPage,
    },
  ]
}
