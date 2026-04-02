import { ElectronAPI } from '@electron-toolkit/preload'

export type DeckRow = {
  id: number
  name: string
  cover_card_id: number | null
  cover_card_image_url: string | null
  cover_card_image_url_small: string | null
}

export type NegateRow = {
  id: number
  target_deck_id: number
  negate_card_id: number
  negate_card_name: string
  negate_card_image_url_small: string
  target_card_id: number
  target_card_name: string
  target_card_image_url_small: string
  note: string | null
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getCardById: (id: number) => Promise<unknown>
      getCardByName: (name: string) => Promise<unknown>
      getCardsByName: (name: string) => Promise<unknown>
      getAllCardNames: () => Promise<string[]>
      getAllCardsBasic: () => Promise<{ name: string; type: string }[]>
      getAllDecks: () => Promise<DeckRow[]>
      createDeck: (name: string, coverCardId: number | null) => Promise<number>
      deleteDeck: (id: number) => Promise<void>
      getNegatesForDeck: (deckId: number) => Promise<NegateRow[]>
      createNegate: (targetDeckId: number, negateCardId: number, targetCardId: number, note?: string) => Promise<number>
      deleteNegate: (id: number) => Promise<void>
    }
  }
}
