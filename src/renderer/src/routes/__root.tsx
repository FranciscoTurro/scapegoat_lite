import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CardSearcher } from '../components/CardSearcher'
import { CardSearchProvider } from '../context/CardSearchContext'

export const rootRoute = createRootRoute({
  component: () => (
    <CardSearchProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
        <div className="w-[30%] shrink-0 flex flex-col">
          <CardSearcher />
        </div>
      </div>
    </CardSearchProvider>
  )
})
