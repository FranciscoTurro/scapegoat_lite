import { Link } from '@tanstack/react-router'
import { Moon, Sun, Settings, Home, Swords, Ban } from 'lucide-react'
import { Button } from './ui/button'

const NAV_LINKS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/rival-tracker', icon: Swords, label: 'Rival Tracker' },
  { to: '/negates', icon: Ban, label: 'Negates' }
] as const

export function NavBar({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  return (
    <div className="h-12 shrink-0 flex items-center px-3 border-b border-border bg-background">
      <div className="flex items-center gap-1 flex-1">
        {NAV_LINKS.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to}>
            {({ isActive }) => (
              <Button variant={isActive ? 'secondary' : 'ghost'} size="icon-lg" title={label}>
                <Icon />
              </Button>
            )}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={toggleDark}
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun /> : <Moon />}
        </Button>
        <Button variant="ghost" size="icon-lg" title="Settings">
          <Settings />
        </Button>
      </div>
    </div>
  )
}
