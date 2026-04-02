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
