import { useState, useEffect, useRef } from 'react'
import { CardNameInput } from './CardNameInput'
import { useCardSearch } from '../context/CardSearchContext'
import type { Card } from '../types/card'

export function CardLookupPanel() {
  const { registerCardViewer } = useCardSearch()
  const [displayCard, setDisplayCard] = useState<Card | null>(null)

  const showCardRef = useRef<(card: Card) => Promise<void>>(null)
  showCardRef.current = async (card: Card) => {
    const arts = (await window.api.getCardsByName(card.name)) as Card[]
    const list = arts.length > 0 ? arts : [card]
    const idx = list.findIndex((a) => a.id === card.id)
    const resolvedIdx = idx >= 0 ? idx : 0
    setDisplayCard(list[resolvedIdx])
  }

  useEffect(() => {
    registerCardViewer((card) => showCardRef.current?.(card))
  }, [])

  const handleSearch = async (name: string) => {
    const arts = (await window.api.getCardsByName(name)) as Card[]
    if (arts.length > 0) {
      setDisplayCard(arts[0])
    }
  }

  const card = displayCard

  return (
    <div className="flex flex-col h-full border-l border-border">
      <div className="flex-1 items-center overflow-y-auto p-4 flex flex-col gap-4">
        <CardNameInput
          onSelect={handleSearch}
          placeholder="Search cards…"
          inputClassName="h-10 text-base"
        />

        {card && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <p className="font-semibold">{card.name}</p>
              <p className="text-muted-foreground">{card.human_readable_card_type ?? card.type}</p>
              {card.level != null && <p>Level: {card.level}</p>}
              {card.attribute && <p>Attribute: {card.attribute}</p>}
              {card.race && <p>Race: {card.race}</p>}
              {card.atk != null && (
                <p>
                  ATK: {card.atk} / DEF: {card.def}
                </p>
              )}
              {card.linkval != null && <p>Link: {card.linkval}</p>}
              {card.archetype && <p>Archetype: {card.archetype}</p>}
              <p className="text-muted-foreground leading-snug mt-1 whitespace-pre-wrap">
                {card.desc}
              </p>
            </div>
          </div>
        )}
        <img
          src={card != null ? card.image_url : ''}
          alt={card != null ? card.name : ''}
          className="rounded-md w-full object-contain"
        />
      </div>
    </div>
  )
}
