import { useState } from 'react'
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
  DialogTrigger
} from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { CardNameInput } from '../../components/CardNameInput'
import { Card } from '../../types/card'
import { ComboRow } from '../../types/combo'

export function CreateComboDialog({ onCreated }: { onCreated: (combo: ComboRow) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [coverCardName, setCoverCardName] = useState('')
  const [coverCardId, setCoverCardId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const reset = () => {
    setName('')
    setCoverCardName('')
    setCoverCardId(null)
  }

  const handleCoverCardSelect = async (cardName: string) => {
    setCoverCardName(cardName)
    const card = (await window.api.getCardByName(cardName)) as Card | undefined
    setCoverCardId(card?.id ?? null)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    const id = await window.api.createCombo(name.trim(), coverCardId)
    const combos = await window.api.getAllCombos()
    const created = combos.find((c) => c.id === id)
    if (created) onCreated(created)
    setOpen(false)
    reset()
    setSubmitting(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          <Plus />
          New Combo
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>New Combo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground">Combo name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Snake-Eye 1-card"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground">Cover card (optional)</Label>
            {coverCardId ? (
              <div className="flex items-center gap-2">
                <span className="text-xs truncate flex-1">{coverCardName}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setCoverCardName('')
                    setCoverCardId(null)
                  }}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <CardNameInput
                onSelect={handleCoverCardSelect}
                placeholder="Search card…"
                clearOnSelect={false}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="lg">
              Cancel
            </Button>
          </DialogClose>
          <Button size="lg" onClick={handleSubmit} disabled={!name.trim() || submitting}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
