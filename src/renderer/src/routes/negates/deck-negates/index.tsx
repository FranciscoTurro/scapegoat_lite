import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { createRoute, useParams, useNavigate } from '@tanstack/react-router'
import { rootRoute } from '../../__root'
import { Button } from '../../../components/ui/button'
import { useCardSearch } from '../../../context/CardSearchContext'
import { CreateNegateDialog } from '../CreateNegateDialog'
import { NegateEntry } from './NegateEntry'
import { DeckRow, NegateRow } from '../types'

export const deckNegatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/negates/$deckId',
  component: DeckNegatesPage
})

function DeckNegatesPage() {
  const { deckId } = useParams({ from: '/negates/$deckId' })
  const navigate = useNavigate()
  const { requestCardView } = useCardSearch()
  const [deck, setDeck] = useState<DeckRow | null>(null)
  const [negates, setNegates] = useState<NegateRow[]>([])

  useEffect(() => {
    window.api.getAllDecks().then((decks) => {
      const found = (decks as DeckRow[]).find((d) => d.id === Number(deckId))
      setDeck(found ?? null)
    })
    window.api.getNegatesForDeck(Number(deckId)).then((rows) => setNegates(rows as NegateRow[]))
  }, [deckId])

  const handleNegateCreated = (negate: NegateRow) => {
    setNegates((prev) =>
      [...prev, negate].sort((a, b) => a.target_card_name.localeCompare(b.target_card_name))
    )
  }

  const handleNegateDeleted = async (id: number) => {
    await window.api.deleteNegate(id)
    setNegates((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="p-6 flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/negates' })}>
            <ChevronLeft />
          </Button>
          <h2 className="text-lg font-bold">{deck?.name ?? '…'}</h2>
        </div>
        <CreateNegateDialog
          decks={deck ? [deck] : []}
          preselectedDeckId={Number(deckId)}
          showDeckSelect={false}
          onCreated={handleNegateCreated}
        />
      </div>

      {negates.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          No negates for this deck yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {negates.map((negate) => (
            <NegateEntry
              key={negate.id}
              negate={negate}
              onDelete={() => handleNegateDeleted(negate.id)}
              onCardClick={requestCardView}
            />
          ))}
        </div>
      )}
    </div>
  )
}
