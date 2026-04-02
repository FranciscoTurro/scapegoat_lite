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
