import { createContext, useContext, useRef, ReactNode } from 'react'
import { Card } from '../types/card'

type CardSearchContextType = {
  requestCardView: (card: Card) => void
  registerCardViewer: (handler: (card: Card) => void) => void
}

const CardSearchContext = createContext<CardSearchContextType>({
  requestCardView: () => {},
  registerCardViewer: () => {}
})

export function CardSearchProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<((card: Card) => void) | null>(null)

  const registerCardViewer = (handler: (card: Card) => void) => {
    handlerRef.current = handler
  }

  const requestCardView = (card: Card) => {
    handlerRef.current?.(card)
  }

  return (
    <CardSearchContext.Provider value={{ requestCardView, registerCardViewer }}>
      {children}
    </CardSearchContext.Provider>
  )
}

export const useCardSearch = () => useContext(CardSearchContext)
