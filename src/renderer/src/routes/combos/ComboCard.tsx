import { useState } from 'react'
import { Trash2, Pencil, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { CardNameInput } from '../../components/CardNameInput'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../../components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '../../components/ui/dialog'
import { ComboRow } from '../../types/combo'
import { Card } from '../../types/card'

export function ComboCard({
  combo,
  onClick,
  onDelete,
  onUpdated
}: {
  combo: ComboRow
  onClick: () => void
  onDelete: () => void
  onUpdated: (updated: ComboRow) => void
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState(combo.name)
  const [coverCardId, setCoverCardId] = useState<number | null>(combo.cover_card_id)
  const [coverCardName, setCoverCardName] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleEditOpen = (val: boolean) => {
    if (val) {
      setName(combo.name)
      setCoverCardId(combo.cover_card_id)
      setCoverCardName(null)
    }
    setEditOpen(val)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    await window.api.updateCombo(combo.id, name.trim(), coverCardId)
    const combos = await window.api.getAllCombos()
    const updated = combos.find((c) => c.id === combo.id)
    if (updated) onUpdated(updated)
    setEditOpen(false)
    setSubmitting(false)
  }

  const handleCoverCardSelect = async (cardName: string) => {
    const card = (await window.api.getCardByName(cardName)) as Card | undefined
    if (card) { setCoverCardId(card.id); setCoverCardName(card.name) }
  }

  const clearCover = () => { setCoverCardId(null); setCoverCardName(null) }

  const coverLabel = coverCardName ?? (combo.cover_card_id ? combo.name : null)

  return (
    <div className="relative group flex flex-col items-center gap-2 rounded-lg border border-foreground p-3 hover:border-primary transition-all w-48">

      {/* Delete */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon-xs"
            className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete combo?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{combo.name}" and all its steps.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="lg">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" size="lg" onClick={onDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit */}
      <Dialog open={editOpen} onOpenChange={handleEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon-xs"
            className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil />
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Edit combo</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground">Combo name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground">Cover card</Label>
              {coverCardId ? (
                <div className="flex items-center gap-2 border border-border rounded-md px-3 h-9">
                  <span className="text-xs truncate flex-1">{coverLabel}</span>
                  <Button variant="ghost" size="icon-sm" onClick={clearCover}>
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
              <Button variant="ghost" size="lg">Cancel</Button>
            </DialogClose>
            <Button size="lg" onClick={handleSave} disabled={!name.trim() || submitting}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer hover:bg-accent/30 rounded w-full transition-colors">
        {combo.cover_card_image_url_small ? (
          <img src={combo.cover_card_image_url_small} alt={combo.name} className="w-36 rounded" />
        ) : (
          <div className="w-24 h-35 rounded border border-border bg-muted flex items-center justify-center text-muted-foreground text-xs">
            No card
          </div>
        )}
        <span className="text font-medium text-center leading-tight">{combo.name}</span>
      </div>
    </div>
  )
}
