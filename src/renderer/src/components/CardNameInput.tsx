import { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from './ui/input'

type CardBasic = { name: string; type: string }

function TypeBadge({ type }: { type: string }) {
  if (type.includes('Spell'))
    return (
      <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 shrink-0">
        Spell
      </span>
    )
  if (type.includes('Trap'))
    return (
      <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 shrink-0">
        Trap
      </span>
    )
  return (
    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 shrink-0">
      Monster
    </span>
  )
}

type Props = {
  onSelect: (name: string) => void
  placeholder?: string
  clearOnSelect?: boolean
  inputClassName?: string
}

export function CardNameInput({
  onSelect,
  placeholder = 'Card name…',
  clearOnSelect = false,
  inputClassName
}: Props) {
  const [allCards, setAllCards] = useState<CardBasic[]>([])
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<CardBasic[]>([])
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.api.getAllCardsBasic().then(setAllCards)
  }, [])

  const filter = useCallback(
    (q: string) => {
      if (!q) return []
      const lower = q.toLowerCase()
      return allCards.filter((c) => c.name.toLowerCase().includes(lower)).slice(0, 20)
    },
    [allCards]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    const results = filter(q)
    setSuggestions(results)
    setHighlighted(0)
    setOpen(results.length > 0)
  }

  const commit = (name: string) => {
    setQuery(clearOnSelect ? '' : name)
    setOpen(false)
    setSuggestions([])
    onSelect(name)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = suggestions[highlighted] ?? suggestions[0]
      if (target) commit(target.name)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md max-h-64 overflow-y-auto text-sm">
          {suggestions.map((card, i) => (
            <li
              key={card.name}
              onMouseDown={() => commit(card.name)}
              onMouseEnter={() => setHighlighted(i)}
              className={`cursor-pointer px-3 py-1.5 flex items-center justify-between gap-2 ${
                i === highlighted ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <span className="truncate">{card.name}</span>
              <TypeBadge type={card.type} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
