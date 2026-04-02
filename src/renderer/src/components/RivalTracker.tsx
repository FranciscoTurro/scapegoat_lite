import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { CardNameInput } from './CardNameInput'
import { useCardSearch } from '../context/CardSearchContext'
import { Card } from '../types/card'

const HAND_KEY = 'rival-hand'
const SET_KEY = 'rival-set'
const MAX_SET = 5

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function CardBack({ onClick, onRemove }: { onClick: () => void; onRemove: () => void }) {
  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault()
        onRemove()
      }}
      title="Right-click to remove"
      className="w-18 h-26.25 rounded border border-border bg-blue-950 cursor-pointer flex items-center justify-center text-blue-300 text-xl select-none hover:border-primary transition-colors shrink-0"
    >
      ?
    </div>
  )
}

function TrackerSection({
  title,
  cards,
  onAdd,
  onRemove,
  onCardClick,
  onReset,
  maxCards,
  faceDown = false
}: {
  title: string
  cards: Card[]
  onAdd: (name: string) => void
  onRemove: (index: number) => void
  onCardClick: (card: Card) => void
  onReset: () => void
  maxCards?: number
  faceDown?: boolean
}) {
  const canAdd = maxCards === undefined || cards.length < maxCards

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {title}
          {maxCards !== undefined && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {cards.length}/{maxCards}
            </span>
          )}
        </h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs">
          Reset
        </Button>
      </div>

      {canAdd && <CardNameInput onSelect={onAdd} placeholder="Add card…" clearOnSelect />}

      <div className="flex flex-wrap gap-2 min-h-10">
        {cards.map((card, i) =>
          faceDown ? (
            <CardBack
              key={`${card.id}-${i}`}
              onClick={() => onCardClick(card)}
              onRemove={() => onRemove(i)}
            />
          ) : (
            <img
              key={`${card.id}-${i}`}
              src={card.image_url_small}
              alt={card.name}
              onClick={() => onCardClick(card)}
              onContextMenu={(e) => {
                e.preventDefault()
                onRemove(i)
              }}
              title={`${card.name} — Right-click to remove`}
              className="w-18 rounded cursor-pointer hover:ring-2 ring-primary transition-all shrink-0"
            />
          )
        )}
      </div>
    </div>
  )
}

export function RivalTracker() {
  const { requestCardView } = useCardSearch()
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
    if (setCards.length >= MAX_SET) return
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
        maxCards={MAX_SET}
      />
    </div>
  )
}
