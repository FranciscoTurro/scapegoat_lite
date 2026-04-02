import { useState, useEffect } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CardSearchProvider } from '../context/CardSearchContext'
import { CardLookupPanel } from '../components/CardLookupPanel'
import { NavBar } from '../components/NavBar'

function RootLayout() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <CardSearchProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <NavBar dark={darkMode} toggleDark={() => setDarkMode((d) => !d)} />
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

export const rootRoute = createRootRoute({ component: RootLayout })
