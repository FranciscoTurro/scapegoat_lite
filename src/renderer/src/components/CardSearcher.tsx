import { useState, useEffect, useRef } from 'react'
import { CardNameInput } from './CardNameInput'
import { useCardSearch } from '../context/CardSearchContext'
import { Card } from '../types/card'

export function CardSearcher() {
  const { registerCardViewer } = useCardSearch()
  const [displayCard, setDisplayCard] = useState<Card | null>(null)
  const [altArts, setAltArts] = useState<Card[]>([])
  const [altIndex, setAltIndex] = useState(0)

  // Use a ref so the registered handler always has fresh state setters
  const showCardRef = useRef<(card: Card) => Promise<void>>()
  showCardRef.current = async (card: Card) => {
    const arts = (await window.api.getCardsByName(card.name)) as Card[]
    const list = arts.length > 0 ? arts : [card]
    const idx = list.findIndex((a) => a.id === card.id)
    const resolvedIdx = idx >= 0 ? idx : 0
    setAltArts(list)
    setAltIndex(resolvedIdx)
    setDisplayCard(list[resolvedIdx])
  }

  useEffect(() => {
    registerCardViewer((card) => showCardRef.current?.(card))
  }, [])

  const handleSearch = async (name: string) => {
    const arts = (await window.api.getCardsByName(name)) as Card[]
    if (arts.length > 0) {
      setAltArts(arts)
      setAltIndex(0)
      setDisplayCard(arts[0])
    }
  }

  const card = displayCard

  return (
    <div className="flex flex-col h-full border-l border-border">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <CardNameInput
          onSelect={handleSearch}
          placeholder="Search cards…"
          inputClassName="h-10 text-base"
        />

        {card && (
          <div className="flex flex-col gap-3">
            <img
              src={card.image_url}
              alt={card.name}
              className="rounded-md w-full object-contain"
            />

            {altArts.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {altArts.map((a, i) => (
                  <img
                    key={a.id}
                    src={a.image_url_small}
                    alt={a.name}
                    onClick={() => {
                      setAltIndex(i)
                      setDisplayCard(altArts[i])
                    }}
                    className={`w-10 rounded cursor-pointer border-2 transition-colors ${
                      i === altIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            )}

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
      </div>
    </div>
  )
}
