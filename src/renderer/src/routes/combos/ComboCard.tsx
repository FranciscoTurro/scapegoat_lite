import { Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
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
import { ComboRow } from '../../types/combo'

export function ComboCard({
  combo,
  onClick,
  onDelete
}: {
  combo: ComboRow
  onClick: () => void
  onDelete: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="relative group flex flex-col items-center gap-2 cursor-pointer rounded-lg border border-foreground p-3 hover:border-primary hover:bg-accent/30 transition-all w-48"
    >
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

      {combo.cover_card_image_url_small ? (
        <img src={combo.cover_card_image_url_small} alt={combo.name} className="w-36 rounded" />
      ) : (
        <div className="w-24 h-35 rounded border border-border bg-muted flex items-center justify-center text-muted-foreground text-xs">
          No card
        </div>
      )}

      <span className="text font-medium text-center leading-tight">{combo.name}</span>
    </div>
  )
}
