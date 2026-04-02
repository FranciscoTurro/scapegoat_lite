import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../__root'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage
})

function IndexPage() {
  return <div className="flex flex-col gap-4 p-8 items-center">nothing here for now</div>
}
