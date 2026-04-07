import { ElectronAPI } from '@electron-toolkit/preload'

export type DeckRow = {
  id: number
  name: string
  cover_card_id: number | null
  cover_card_image_url: string | null
  cover_card_image_url_small: string | null
}

export type ComboRow = {
  id: number
  name: string
  cover_card_id: number | null
  cover_card_image_url: string | null
  cover_card_image_url_small: string | null
}

export type ComboStepRow = {
  id: number
  combo_id: number
  position: number
  card_id: number
  card_name: string
  card_image_url_small: string
  note: string | null
  link_comment: string | null
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
      getAllCombos: () => Promise<ComboRow[]>
      createCombo: (name: string, coverCardId: number | null) => Promise<number>
      deleteCombo: (id: number) => Promise<void>
      getStepsForCombo: (comboId: number) => Promise<ComboStepRow[]>
      addComboStep: (comboId: number, cardId: number, note: string | null, linkComment: string | null, position: number) => Promise<number>
      deleteComboStep: (id: number) => Promise<void>
      updateComboStepNote: (id: number, note: string | null) => Promise<void>
      updateComboStepLink: (id: number, linkComment: string | null) => Promise<void>
      reorderComboSteps: (orderedIds: number[]) => Promise<void>
      syncCards: (startDate: string) => Promise<void>
    }
  }
}
