import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CardLookupPanel } from '../components/CardLookupPanel'

export const rootRoute = createRootRoute({
  component: () => (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <div className="w-[30%] shrink-0 flex flex-col">
        <CardLookupPanel />
      </div>
    </div>
  )
})
