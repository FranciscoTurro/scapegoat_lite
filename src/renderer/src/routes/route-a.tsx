import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { RivalTracker } from '../components/RivalTracker'

export const routeARoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/route-a',
  component: RivalTracker
})
