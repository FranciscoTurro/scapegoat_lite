import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { Button } from '../components/ui/button'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage
})

function IndexPage() {
  return (
    <div className="flex flex-col gap-4 p-8 items-center">
      <Link to="/route-a">
        <Button>Rival Tracker</Button>
      </Link>
      <Link to="/route-b">
        <Button>Route B</Button>
      </Link>
    </div>
  )
}
