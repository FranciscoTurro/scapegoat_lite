import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { routeBRoute } from './routes/route-b'
import { rivalRoute } from './routes/rival-tracker'
import { negatesRoute } from './routes/negates'

const routeTree = rootRoute.addChildren([indexRoute, rivalRoute, negatesRoute, routeBRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
