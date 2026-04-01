import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const routeARoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/route-a',
  component: () => <div className="p-8">Hi this is route A</div>
})
