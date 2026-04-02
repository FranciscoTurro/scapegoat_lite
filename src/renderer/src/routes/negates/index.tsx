import { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { rootRoute } from '../__root'
import { CreateDeckDialog } from './CreateDeckDialog'
import { CreateNegateDialog } from './CreateNegateDialog'
import { DeckCard } from './DeckCard'
import { DeckRow } from './types'

export const negatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/negates',
  component: NegatesPage
})

function NegatesPage() {
  const navigate = useNavigate()
  const [decks, setDecks] = useState<DeckRow[]>([])

  useEffect(() => {
    window.api.getAllDecks().then(setDecks)
  }, [])

  const handleDeckCreated = (deck: DeckRow) => {
    setDecks((prev) => [...prev, deck].sort((a, b) => a.name.localeCompare(b.name)))
  }

  const handleDeckDeleted = async (id: number) => {
    await window.api.deleteDeck(id)
    setDecks((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="p-6 flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Negates</h2>
        <div className="flex items-center gap-2">
          <CreateDeckDialog onCreated={handleDeckCreated} />
          <CreateNegateDialog decks={decks} preselectedDeckId={null} onCreated={() => {}} />
        </div>
      </div>

      {decks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          No decks yet — create one to get started.
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onClick={() => navigate({ to: '/negates/$deckId', params: { deckId: String(deck.id) } })}
              onDelete={() => handleDeckDeleted(deck.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
