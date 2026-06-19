import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'

import { env } from './env';
import { makeRoutes } from '@/router';
import App from './App.vue'

export const createApp = ViteSSG(App, { routes: makeRoutes(env) }, ({ app }) => {
  app.use(createPinia());
})

export const includedRoutes = (paths: string[]) => {
  return paths.map(path => `${path}/index`)
}
