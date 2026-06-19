import type { RouteRecordRaw } from 'vue-router'
import { RoutesNames } from '../contants'

import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import MazeGenerationPage from '@/pages/MazeGenerationPage.vue'
import type { IEnv } from '@/env'

export const makeRoutes = (env: IEnv): readonly RouteRecordRaw[] => {
  const makePath = env.REPO_NAME
    ? (path: string) => `/${env.REPO_NAME}${path}`
    : (path: string) => `${path}`

  return [
    {
      path: makePath('/'),
      name: RoutesNames.Home,
      component: HomePage,
    },
    {
      path: makePath('/about'),
      name: RoutesNames.About,
      component: AboutPage,
    },
    {
      path: makePath('/maze-generation'),
      name: RoutesNames.MazeGeneration,
      component: MazeGenerationPage,
    },
  ]
}
