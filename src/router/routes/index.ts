import type { RouteRecordRaw } from 'vue-router'
import { RoutesNames } from '../contants'

import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import MazeGenerationPage from '@/pages/MazeGenerationPage.vue'
import BaseLayout from '@/layouts/base/BaseLayout.vue'

export const makeRoutes = (): readonly RouteRecordRaw[] => {
  return [
    {
      path: '/',
      component: BaseLayout,
      redirect: { name: RoutesNames.Home },
      children: [
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
    },
  ]
}
