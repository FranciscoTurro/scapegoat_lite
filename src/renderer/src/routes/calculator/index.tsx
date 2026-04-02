import { useState } from 'react'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../__root'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export const calculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculator',
  component: CalculatorPage
})

const STARTING_LP = 8000

function PlayerPanel({
  lp,
  onDamage,
  onGain,
  onHalve
}: {
  lp: number
  onDamage: (amount: number) => void
  onGain: (amount: number) => void
  onHalve: () => void
}) {
  const [input, setInput] = useState('')

  const parsed = parseInt(input, 10)
  const valid = !isNaN(parsed) && parsed > 0

  const handleDamage = () => {
    if (valid) {
      onDamage(parsed)
      setInput('')
    }
  }

  const handleGain = () => {
    if (valid) {
      onGain(parsed)
      setInput('')
    }
  }

  const dead = lp <= 0

  return (
    <div
      className={`flex-1 flex flex-col gap-4 p-6 rounded-xl border ${dead ? 'border-destructive bg-destructive/5' : 'border-border bg-card'}`}
    >
      <div
        className={`text-5xl font-bold tabular-nums text-center py-4 ${dead ? 'text-destructive' : 'text-foreground'}`}
      >
        {dead ? 'DEAD' : lp.toLocaleString()}
      </div>

      <div className="flex gap-2">
        <Input
          className="flex-1 text-center"
          placeholder="Amount"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleDamage()
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="destructive" className="flex-1" disabled={!valid} onClick={handleDamage}>
          - Damage
        </Button>
        <Button variant="outline" className="flex-1" disabled={!valid} onClick={handleGain}>
          + Gain
        </Button>
      </div>

      <Button variant="outline" size="sm" onClick={onHalve} disabled={dead}>
        Halve
      </Button>
    </div>
  )
}

function CalculatorPage() {
  const [rivalLP, setRivalLP] = useState(STARTING_LP)

  const applyDamage = (amount: number) => {
    setRivalLP((prev) => {
      const next = Math.max(0, prev - amount)
      return next
    })
  }

  const applyGain = (amount: number) => {
    setRivalLP((prev) => {
      const next = prev + amount
      return next
    })
  }

  const applyHalve = (player: 'you' | 'rival') => {
    setRivalLP((prev) => {
      const next = Math.floor(prev / 2)
      return next
    })
  }

  const reset = () => {
    setRivalLP(STARTING_LP)
  }

  return (
    <div className="p-6 flex flex-col gap-6 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Life Points Calculator</h2>
        <Button variant="destructive" size="lg" onClick={reset} className="h-10">
          Reset
        </Button>
      </div>

      <div className="flex gap-4">
        <PlayerPanel
          lp={rivalLP}
          onDamage={(n) => applyDamage(n)}
          onGain={(n) => applyGain(n)}
          onHalve={() => applyHalve('rival')}
        />
      </div>
    </div>
  )
}
