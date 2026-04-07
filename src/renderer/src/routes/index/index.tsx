import { useEffect, useState } from 'react'
import { createRoute, Link } from '@tanstack/react-router'
import { rootRoute } from '../__root'
import { Layers, Swords, Ban, Calculator } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

const FEATURES = [
  {
    to: '/combos',
    icon: Layers,
    label: 'Combos',
    description: 'Save and browse card combos.'
  },
  {
    to: '/rival-tracker',
    icon: Swords,
    label: 'Rival Tracker',
    description: "Track your opponent's hand and set cards during a duel."
  },
  {
    to: '/negates',
    icon: Ban,
    label: 'Negates',
    description: 'Log what negates each rival deck is playing.'
  },
  {
    to: '/calculator',
    icon: Calculator,
    label: 'Calculator',
    description: 'Life point calculator for some quick maths.'
  }
] as const

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage
})

function IndexPage() {
  const { settings } = useSettings()
  const [comboCount, setComboCount] = useState<number | null>(null)
  const [deckCount, setDeckCount] = useState<number | null>(null)
  const [negateCount, setNegateCount] = useState<number | null>(null)

  useEffect(() => {
    window.api.getAllCombos().then((combos) => setComboCount(combos.length))

    window.api.getAllDecks().then(async (decks) => {
      setDeckCount(decks.length)
      const negateCounts = await Promise.all(
        decks.map((d) => window.api.getNegatesForDeck(d.id).then((n) => n.length))
      )
      setNegateCount(negateCounts.reduce((sum, n) => sum + n, 0))
    })
  }, [])

  const lastSyncDisplay = settings.lastSync ? settings.lastSync.split('-').reverse().join('/') : '—'

  const dbStats = [
    { label: 'Combos saved', value: comboCount === null ? '—' : String(comboCount) },
    { label: 'Decks tracked', value: deckCount === null ? '—' : String(deckCount) },
    { label: 'Negates logged', value: negateCount === null ? '—' : String(negateCount) }
  ]

  return (
    <div className="p-8 flex flex-col gap-12 max-w-2xl mx-auto items-center w-full">
      <div className="flex gap-8 justify-center items-start">
        {dbStats.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1 items-center">
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
        <div className="w-px self-stretch bg-border mx-2" />
        <div className="flex flex-col gap-1 items-center">
          <span className="text-2xl font-bold">{lastSyncDisplay}</span>
          <span className="text-sm text-muted-foreground">Last sync</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 grid-rows-2">
        {FEATURES.map(({ to, icon: Icon, label, description }) => (
          <Link key={to} to={to} className="h-full">
            {({ isActive }) => (
              <div
                className={`h-full flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${isActive ? 'bg-accent' : 'bg-card'}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
