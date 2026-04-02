import { Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog'
import { NegateRow } from '../types'
import { Card } from '../../../types/card'

export function NegateEntry({
  negate,
  onDelete,
  onCardClick
}: {
  negate: NegateRow
  onDelete: () => void
  onCardClick: (card: Card) => void
}) {
  const handleCardClick = async (cardId: number) => {
    const card = (await window.api.getCardById(cardId)) as Card | undefined
    if (card) onCardClick(card)
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-foreground p-4 hover:bg-accent/20 transition-colors group">
      <img
        src={negate.negate_card_image_url_small}
        alt={negate.negate_card_name}
        onClick={() => handleCardClick(negate.negate_card_id)}
        title={negate.negate_card_name}
        className="w-16 rounded cursor-pointer hover:ring-2 ring-primary transition-all shrink-0"
      />

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-xs text-muted-foreground">negates</span>
        <span className="text-sm font-medium truncate">{negate.target_card_name}</span>
        {negate.note && (
          <span className="text-xs text-muted-foreground italic truncate">{negate.note}</span>
        )}
      </div>

      <img
        src={negate.target_card_image_url_small}
        alt={negate.target_card_name}
        onClick={() => handleCardClick(negate.target_card_id)}
        title={negate.target_card_name}
        className="w-16 rounded cursor-pointer hover:ring-2 ring-destructive transition-all shrink-0"
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon-xs"
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete negate?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove "{negate.negate_card_name}" → "{negate.target_card_name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="lg">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" size="lg" onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
