import { useState, useEffect } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import { rootRoute } from '../__root'
import { Input } from '../../components/ui/input'
import { ComboCard } from './ComboCard'
import { CreateComboDialog } from './CreateComboDialog'
import { ComboRow } from '../../types/combo'

export const combosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/combos',
  component: CombosPage
})

function CombosPage() {
  const navigate = useNavigate()
  const [combos, setCombos] = useState<ComboRow[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    window.api.getAllCombos().then(setCombos)
  }, [])

  const handleCreated = (combo: ComboRow) => {
    setCombos((prev) => [...prev, combo].sort((a, b) => a.name.localeCompare(b.name)))
  }

  const handleDelete = async (id: number) => {
    await window.api.deleteCombo(id)
    setCombos((prev) => prev.filter((c) => c.id !== id))
  }

  const filtered = search.trim()
    ? combos.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : combos

  return (
    <div className="p-6 flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Combos</h2>
        <CreateComboDialog onCreated={handleCreated} />
      </div>

      <Input
        placeholder="Search combos…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          {combos.length === 0 ? 'No combos yet — create one to get started.' : 'No combos match your search.'}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {filtered.map((combo) => (
            <ComboCard
              key={combo.id}
              combo={combo}
              onClick={() => navigate({ to: '/combos/$comboId', params: { comboId: String(combo.id) } })}
              onDelete={() => handleDelete(combo.id)}
              onUpdated={(updated) => setCombos((prev) => prev.map((c) => c.id === updated.id ? updated : c).sort((a, b) => a.name.localeCompare(b.name)))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
