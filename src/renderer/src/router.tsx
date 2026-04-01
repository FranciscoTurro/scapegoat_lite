import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { routeARoute } from './routes/route-a'
import { routeBRoute } from './routes/route-b'

const routeTree = rootRoute.addChildren([indexRoute, routeARoute, routeBRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
