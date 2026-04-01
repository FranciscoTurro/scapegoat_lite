import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const routeBRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/route-b',
  component: () => <div className="p-8">Hi this is route B</div>
})
