import { Link } from '@tanstack/react-router'
import { Home, Swords, Ban, Calculator, Layers } from 'lucide-react'
import { Button } from './ui/button'
import { SettingsDialog } from './SettingsDialog'

const NAV_LINKS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/combos', icon: Layers, label: 'Combos' },
  { to: '/rival-tracker', icon: Swords, label: 'Rival Tracker' },
  { to: '/negates', icon: Ban, label: 'Negates' },
  { to: '/calculator', icon: Calculator, label: 'Calculator' }
] as const

export function NavBar() {
  return (
    <div className="h-12 shrink-0 flex items-center px-3 border-b border-border bg-background">
      <div className="flex items-center gap-1 flex-1">
        {NAV_LINKS.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to}>
            {({ isActive }) => (
              <Button variant={isActive ? 'secondary' : 'ghost'} size="icon-lg" title={label}>
                <Icon color={isActive ? '#FA7A00' : 'white'} />
              </Button>
            )}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <SettingsDialog />
      </div>
    </div>
  )
}
