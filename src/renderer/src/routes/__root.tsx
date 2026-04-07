import { useEffect } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CardSearchProvider } from '../context/CardSearchContext'
import { SettingsProvider, useSettings } from '../context/SettingsContext'
import { CardLookupPanel } from '../components/CardLookupPanel'
import { NavBar } from '../components/NavBar'

function RootLayout() {
  const { settings } = useSettings()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings.darkMode])

  return (
    <CardSearchProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <NavBar />
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
        <div className="w-[30%] shrink-0 flex flex-col">
          <CardLookupPanel />
        </div>
      </div>
    </CardSearchProvider>
  )
}

export const rootRoute = createRootRoute({
  component: () => (
    <SettingsProvider>
      <RootLayout />
    </SettingsProvider>
  )
})
