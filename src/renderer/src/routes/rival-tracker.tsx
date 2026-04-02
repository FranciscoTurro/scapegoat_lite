import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { RivalTracker } from '../components/RivalTracker'

export const rivalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rival-tracker',
  component: RivalTracker
})
