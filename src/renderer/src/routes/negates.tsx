import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const negatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/negates',
  component: NegatesPage
})

function NegatesPage() {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Negates — coming soon
    </div>
  )
}
