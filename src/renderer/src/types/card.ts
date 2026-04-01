export type Card = {
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
