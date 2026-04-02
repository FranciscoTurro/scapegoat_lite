import { Button } from '../../components/ui/button'
import { CardNameInput } from '../../components/CardNameInput'
import { Card } from '../../types/card'

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

export function TrackerSection({
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
          {maxCards !== undefined ? (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {cards.length}/{maxCards}
            </span>
          ) : (
            <span className="ml-2 text-xs font-normal text-muted-foreground">{cards.length}</span>
          )}
        </h3>
        <Button variant="destructive" size="lg" onClick={onReset} className="h-10">
          Reset
        </Button>
      </div>

      {canAdd && (
        <CardNameInput
          inputClassName="h-12"
          onSelect={onAdd}
          placeholder="Add card…"
          clearOnSelect
        />
      )}

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
              className="w-48 rounded cursor-pointer hover:ring-2 ring-primary transition-all shrink-0"
            />
          )
        )}
      </div>
    </div>
  )
}
