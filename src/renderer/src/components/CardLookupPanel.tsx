import { useState, useEffect, useRef, useCallback } from 'react'
import { Moon, Sun, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Input } from './ui/input'

type Card = {
  id: number
  name: string
  type: string
  human_readable_card_type: string | null
  desc: string
  race: string
  archetype: string | null
  atk: number | null
  def: number | null
  level: number | null
  attribute: string | null
  linkval: number | null
  image_url: string
  image_url_small: string
}

function CardNameInput({ onSelect }: { onSelect: (name: string) => void }) {
  const [allNames, setAllNames] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.api.getAllCardNames().then(setAllNames)
  }, [])

  const filter = useCallback(
    (q: string) => {
      if (!q) return []
      const lower = q.toLowerCase()
      return allNames.filter((n) => n.toLowerCase().includes(lower)).slice(0, 20)
    },
    [allNames]
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
    setQuery(name)
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
      if (target) commit(target)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Close dropdown on outside click
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
    <div ref={containerRef} className="relative flex-1">
      <Input
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder="Card name…"
        className="h-9"
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md max-h-64 overflow-y-auto text-sm">
          {suggestions.map((name, i) => (
            <li
              key={name}
              onMouseDown={() => commit(name)}
              onMouseEnter={() => setHighlighted(i)}
              className={`cursor-pointer px-3 py-1.5 ${i === highlighted ? 'bg-accent text-accent-foreground' : ''}`}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function CardLookupPanel() {
  const [card, setCard] = useState<Card | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dark, setDark] = useState(true)

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  const lookupByName = async (name: string) => {
    setLoading(true)
    setError(null)
    setCard(null)
    const result = (await window.api.getCardByName(name)) as Card | undefined
    setLoading(false)
    if (!result) {
      setError(`No card found: "${name}"`)
    } else {
      setCard(result)
    }
  }

  return (
    <div className="flex flex-col h-full border-l border-border">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <CardNameInput onSelect={lookupByName} />
          {loading && <span className="text-sm text-muted-foreground">…</span>}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {card && (
          <div className="flex items-center flex-col gap-3">
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
            <img src={card.image_url} alt={card.name} className="rounded-md w-72 object-contain" />
          </div>
        )}
      </div>
      <Separator />
      <div className="flex items-center justify-end gap-2 p-3 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleDark}
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun /> : <Moon />}
        </Button>
        <Button variant="ghost" size="icon-sm" title="Settings">
          <Settings />
        </Button>
      </div>
    </div>
  )
}
