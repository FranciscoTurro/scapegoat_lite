import { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../__root'
import { Separator } from '../../components/ui/separator'
import { useCardSearch } from '../../context/CardSearchContext'
import { useSettings } from '../../context/SettingsContext'
import { Card } from '../../types/card'
import { TrackerSection } from './TrackerSection'

const HAND_KEY = 'rival-hand'
const SET_KEY = 'rival-set'

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const rivalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rival-tracker',
  component: RivalTracker
})

function RivalTracker() {
  const { requestCardView } = useCardSearch()
  const { settings } = useSettings()
  const [hand, setHand] = useState<Card[]>(() => loadFromStorage(HAND_KEY, []))
  const [setCards, setSetCards] = useState<Card[]>(() => loadFromStorage(SET_KEY, []))

  useEffect(() => {
    localStorage.setItem(HAND_KEY, JSON.stringify(hand))
  }, [hand])

  useEffect(() => {
    localStorage.setItem(SET_KEY, JSON.stringify(setCards))
  }, [setCards])

  const addToHand = async (name: string) => {
    const card = (await window.api.getCardByName(name)) as Card | undefined
    if (card) setHand((prev) => [...prev, card])
  }

  const addToSet = async (name: string) => {
    if (setCards.length >= settings.maxSetCards) return
    const card = (await window.api.getCardByName(name)) as Card | undefined
    if (card) setSetCards((prev) => [...prev, card])
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <h2 className="text-lg font-bold">Rival Tracker</h2>

      <TrackerSection
        title="Hand"
        cards={hand}
        onAdd={addToHand}
        onRemove={(i) => setHand((prev) => prev.filter((_, idx) => idx !== i))}
        onCardClick={requestCardView}
        onReset={() => setHand([])}
      />

      <Separator />

      <TrackerSection
        title="Set Cards"
        cards={setCards}
        onAdd={addToSet}
        onRemove={(i) => setSetCards((prev) => prev.filter((_, idx) => idx !== i))}
        onCardClick={requestCardView}
        onReset={() => setSetCards([])}
        maxCards={settings.maxSetCards}
      />
    </div>
  )
}
