import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Label } from '../../components/ui/label'
import { CardNameInput } from '../../components/CardNameInput'
import { Card } from '../../types/card'
import { DeckRow, NegateRow } from './types'

export function CreateNegateDialog({
  decks,
  preselectedDeckId,
  showDeckSelect = true,
  onCreated
}: {
  decks: DeckRow[]
  preselectedDeckId: number | null
  showDeckSelect?: boolean
  onCreated: (negate: NegateRow) => void
}) {
  const [open, setOpen] = useState(false)
  const [deckId, setDeckId] = useState<number | null>(preselectedDeckId)
  const [negateCardId, setNegateCardId] = useState<number | null>(null)
  const [negateCardName, setNegateCardName] = useState('')
  const [targetCardId, setTargetCardId] = useState<number | null>(null)
  const [targetCardName, setTargetCardName] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) setDeckId(preselectedDeckId)
  }, [open, preselectedDeckId])

  const reset = () => {
    setDeckId(preselectedDeckId)
    setNegateCardId(null)
    setNegateCardName('')
    setTargetCardId(null)
    setTargetCardName('')
    setNote('')
  }

  const handleCardSelect = async (
    cardName: string,
    setId: (id: number | null) => void,
    setName: (n: string) => void
  ) => {
    setName(cardName)
    const card = (await window.api.getCardByName(cardName)) as Card | undefined
    setId(card?.id ?? null)
  }

  const handleSubmit = async () => {
    if (!deckId || !negateCardId || !targetCardId) return
    setSubmitting(true)
    const id = await window.api.createNegate(deckId, negateCardId, targetCardId, note.trim() || undefined)
    const negates = await window.api.getNegatesForDeck(deckId)
    const created = negates.find((n) => n.id === id)
    if (created) onCreated(created)
    setOpen(false)
    reset()
    setSubmitting(false)
  }

  const canSubmit = deckId !== null && negateCardId !== null && targetCardId !== null

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus />
          New Negate
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>New Negate</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {showDeckSelect && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground">Against deck</Label>
              <Select
                value={deckId != null ? String(deckId) : ''}
                onValueChange={(v) => setDeckId(v ? Number(v) : null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select deck…" />
                </SelectTrigger>
                <SelectContent>
                  {decks.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground">Use this card to negate</Label>
            {negateCardId ? (
              <div className="flex items-center gap-2">
                <span className="text-xs truncate flex-1">{negateCardName}</span>
                <Button variant="ghost" size="icon-sm" onClick={() => { setNegateCardId(null); setNegateCardName('') }}>
                  <X />
                </Button>
              </div>
            ) : (
              <CardNameInput
                onSelect={(n) => handleCardSelect(n, setNegateCardId, setNegateCardName)}
                placeholder="Negate card…"
                clearOnSelect={false}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground">To stop this card</Label>
            {targetCardId ? (
              <div className="flex items-center gap-2">
                <span className="text-xs truncate flex-1">{targetCardName}</span>
                <Button variant="ghost" size="icon-sm" onClick={() => { setTargetCardId(null); setTargetCardName('') }}>
                  <X />
                </Button>
              </div>
            ) : (
              <CardNameInput
                onSelect={(n) => handleCardSelect(n, setTargetCardId, setTargetCardName)}
                placeholder="Target card…"
                clearOnSelect={false}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground">Note (optional)</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. only on activation"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="lg">Cancel</Button>
          </DialogClose>
          <Button size="lg" onClick={handleSubmit} disabled={!canSubmit || submitting}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
