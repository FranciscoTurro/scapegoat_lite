import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Trash2,
  Pencil,
  Check
} from 'lucide-react'
import { createRoute, useParams, useNavigate } from '@tanstack/react-router'
import { rootRoute } from '../../__root'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { CardNameInput } from '../../../components/CardNameInput'
import { useCardSearch } from '../../../context/CardSearchContext'
import { ComboRow, ComboStepRow } from '../../../types/combo'
import { Card } from '../../../types/card'

export const comboDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/combos/$comboId',
  component: ComboDetailPage
})

const LINK_PRESETS = [
  'searches for',
  'special summons',
  'banishes',
  'sends to GY',
  'tributes',
  'adds to hand',
  'draws',
  'returns to hand',
  'equips'
]

// ── Display mode ─────────────────────────────────────────────────────────────

function DisplaySteps({
  steps,
  onCardClick
}: {
  steps: ComboStepRow[]
  onCardClick: (card: Card) => void
}) {
  return (
    <div className="flex flex-wrap items-start gap-y-6">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1

        const handleClick = async () => {
          const card = (await window.api.getCardById(step.card_id)) as Card | undefined
          if (card) onCardClick(card)
        }

        return (
          <div key={step.id} className="flex items-start">
            {/* Card column */}
            <div className="flex flex-col items-center gap-1.5 w-28">
              <span className="text-xs text-muted-foreground tabular-nums">{i + 1}.</span>
              <img
                src={step.card_image_url_small}
                alt={step.card_name}
                className="w-20 rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleClick}
              />
              <span
                className="text-xs font-medium text-center leading-tight cursor-pointer hover:text-primary transition-colors px-1"
                onClick={handleClick}
              >
                {step.card_name}
              </span>
              {step.note && (
                <span className="text-xs text-muted-foreground italic text-center px-1 leading-tight">
                  {step.note}
                </span>
              )}
            </div>

            {/* Connector */}
            {!isLast && (
              <div className="flex flex-col items-center justify-center pt-10 px-1 min-w-12">
                {step.link_comment && (
                  <span className="text-xs text-muted-foreground text-center whitespace-nowrap mb-1 max-w-20 leading-tight">
                    {step.link_comment}
                  </span>
                )}
                <div className="flex items-center text-muted-foreground/60">
                  <div className="w-6 h-px bg-current" />
                  <ChevronRight className="w-3.5 h-3.5 -ml-1" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Edit mode ─────────────────────────────────────────────────────────────────

function EditStep({
  step,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
  onNoteChange,
  onLinkChange
}: {
  step: ComboStepRow
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onNoteChange: (note: string) => void
  onLinkChange: (link: string) => void
}) {
  const [note, setNote] = useState(step.note ?? '')
  const [link, setLink] = useState(step.link_comment ?? '')
  const noteDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const linkDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleNoteChange = (val: string) => {
    setNote(val)
    if (noteDebounce.current) clearTimeout(noteDebounce.current)
    noteDebounce.current = setTimeout(() => onNoteChange(val), 400)
  }

  const handleLinkChange = (val: string) => {
    setLink(val)
    if (linkDebounce.current) clearTimeout(linkDebounce.current)
    linkDebounce.current = setTimeout(() => onLinkChange(val), 400)
  }

  const applyPreset = (preset: string) => {
    setLink(preset)
    if (linkDebounce.current) clearTimeout(linkDebounce.current)
    onLinkChange(preset)
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex gap-3 items-center">
        <div className="flex flex-col gap-0.5">
          <Button variant="ghost" size="icon-xs" disabled={isFirst} onClick={onMoveUp}>
            <ChevronUp />
          </Button>
          <Button variant="ghost" size="icon-xs" disabled={isLast} onClick={onMoveDown}>
            <ChevronDown />
          </Button>
        </div>
        <img
          src={step.card_image_url_small}
          alt={step.card_name}
          className="w-14 rounded shrink-0"
        />
        <span className="font-medium flex-1">{step.card_name}</span>
        <Button variant="ghost" size="icon-xs" onClick={onDelete}>
          <Trash2 className="text-destructive" />
        </Button>
      </div>

      <Input
        value={note}
        onChange={(e) => handleNoteChange(e.target.value)}
        placeholder="Note (e.g. don't activate if opponent has Ash)…"
      />

      {!isLast && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {LINK_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  link === p
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Input
            value={link}
            onChange={(e) => handleLinkChange(e.target.value)}
            placeholder="Link to next step (e.g. searches for)…"
          />
        </div>
      )}
    </div>
  )
}

// ── Add step form ─────────────────────────────────────────────────────────────

function AddStepForm({
  onAdd
}: {
  onAdd: (cardId: number, cardName: string, note: string | null, linkComment: string | null) => void
}) {
  const [selectedCard, setSelectedCard] = useState<{ id: number; name: string } | null>(null)
  const [note, setNote] = useState('')
  const [link, setLink] = useState('')

  const handleCardSelect = async (name: string) => {
    const card = (await window.api.getCardByName(name)) as Card | undefined
    if (card) setSelectedCard({ id: card.id, name: card.name })
  }

  const handleAdd = () => {
    if (!selectedCard) return
    onAdd(selectedCard.id, selectedCard.name, note.trim() || null, link.trim() || null)
    setSelectedCard(null)
    setNote('')
    setLink('')
  }

  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-border">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          {selectedCard ? (
            <div className="flex items-center gap-2 border border-border rounded-md px-3 h-9">
              <span className="text-sm truncate flex-1">{selectedCard.name}</span>
              <Button variant="ghost" size="icon-xs" onClick={() => setSelectedCard(null)}>
                <X />
              </Button>
            </div>
          ) : (
            <CardNameInput
              onSelect={handleCardSelect}
              placeholder="Add card…"
              clearOnSelect={false}
            />
          )}
        </div>
        <Button size="lg" disabled={!selectedCard} onClick={handleAdd}>
          Add
        </Button>
      </div>

      {selectedCard && (
        <>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)…"
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              {LINK_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setLink(p)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    link === p
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link to next step (optional)…"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
        </>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

function ComboDetailPage() {
  const { comboId } = useParams({ from: '/combos/$comboId' })
  const navigate = useNavigate()
  const { requestCardView } = useCardSearch()

  const [combo, setCombo] = useState<ComboRow | null>(null)
  const [steps, setSteps] = useState<ComboStepRow[]>([])
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    window.api.getAllCombos().then((combos) => {
      const found = combos.find((c) => c.id === Number(comboId))
      setCombo(found ?? null)
    })
    window.api.getStepsForCombo(Number(comboId)).then(setSteps)
  }, [comboId])

  const uniqueCards = steps.reduce<{ id: number; name: string; image: string }[]>((acc, s) => {
    if (!acc.find((c) => c.id === s.card_id)) {
      acc.push({ id: s.card_id, name: s.card_name, image: s.card_image_url_small })
    }
    return acc
  }, [])

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const next = [...steps]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    setSteps(next)
    await window.api.reorderComboSteps(next.map((s) => s.id))
  }

  const handleMoveDown = async (index: number) => {
    if (index === steps.length - 1) return
    const next = [...steps]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    setSteps(next)
    await window.api.reorderComboSteps(next.map((s) => s.id))
  }

  const handleDelete = async (id: number) => {
    await window.api.deleteComboStep(id)
    const next = steps.filter((s) => s.id !== id)
    setSteps(next)
    if (next.length > 0) await window.api.reorderComboSteps(next.map((s) => s.id))
  }

  const handleNoteChange = async (id: number, note: string) => {
    await window.api.updateComboStepNote(id, note || null)
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, note: note || null } : s)))
  }

  const handleLinkChange = async (id: number, link: string) => {
    await window.api.updateComboStepLink(id, link || null)
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, link_comment: link || null } : s)))
  }

  const handleAddStep = async (
    cardId: number,
    _cardName: string,
    note: string | null,
    linkComment: string | null
  ) => {
    const position = steps.length
    await window.api.addComboStep(Number(comboId), cardId, note, linkComment, position)
    const fresh = await window.api.getStepsForCombo(Number(comboId))
    setSteps(fresh)
  }

  return (
    <div className="p-6 flex flex-col gap-6 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/combos' })}>
            <ChevronLeft />
          </Button>
          <h2 className="text-lg font-bold">{combo?.name ?? '…'}</h2>
        </div>
        <Button
          variant={editing ? 'default' : 'outline'}
          size="lg"
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Done
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </>
          )}
        </Button>
      </div>
      {/* Add step — edit mode only */}
      {editing && (
        <div className="shrink-0 max-w-2xl">
          <AddStepForm onAdd={handleAddStep} />
        </div>
      )}

      {/* Steps */}
      <div className="flex-1 overflow-y-auto">
        {steps.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
            {editing
              ? 'Add your first step above.'
              : 'No steps yet — switch to edit mode to build this combo.'}
          </div>
        ) : editing ? (
          <div className="flex flex-col gap-4 max-w-2xl">
            {[...steps].reverse().map((step, _ri) => {
              const i = steps.length - 1 - _ri
              return (
                <EditStep
                  key={step.id}
                  step={step}
                  isFirst={i === 0}
                  isLast={i === steps.length - 1}
                  onMoveUp={() => handleMoveUp(i)}
                  onMoveDown={() => handleMoveDown(i)}
                  onDelete={() => handleDelete(step.id)}
                  onNoteChange={(n) => handleNoteChange(step.id, n)}
                  onLinkChange={(l) => handleLinkChange(step.id, l)}
                />
              )
            })}
          </div>
        ) : (
          <DisplaySteps steps={steps} onCardClick={requestCardView} />
        )}
      </div>
      {uniqueCards.length > 0 && (
        <div className="shrink-0">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Combo pieces
          </div>
          <div className="flex gap-3 flex-wrap">
            {uniqueCards.map((card) => (
              <img
                key={card.id}
                src={card.image}
                alt={card.name}
                title={card.name}
                className="w-14 rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={async () => {
                  const full = (await window.api.getCardById(card.id)) as Card | undefined
                  if (full) requestCardView(full)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
