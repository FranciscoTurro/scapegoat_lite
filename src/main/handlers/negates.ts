import db from '../db'

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

export const getAllDecks = (): DeckRow[] => {
  return db
    .prepare(
      `SELECT d.id, d.name, d.cover_card_id,
              c.image_url AS cover_card_image_url,
              c.image_url_small AS cover_card_image_url_small
       FROM decks d
       LEFT JOIN cards c ON d.cover_card_id = c.id
       ORDER BY d.name`
    )
    .all() as DeckRow[]
}

export const createDeck = (name: string, coverCardId: number | null): number => {
  const result = db
    .prepare(`INSERT INTO decks (name, cover_card_id) VALUES (?, ?)`)
    .run(name, coverCardId)
  return result.lastInsertRowid as number
}

export const updateDeck = (id: number, name: string, coverCardId: number | null): void => {
  db.prepare(`UPDATE decks SET name = ?, cover_card_id = ? WHERE id = ?`).run(name, coverCardId, id)
}

export const deleteDeck = (id: number): void => {
  db.prepare(`DELETE FROM negates WHERE target_deck_id = ?`).run(id)
  db.prepare(`DELETE FROM decks WHERE id = ?`).run(id)
}

export const getNegatesForDeck = (deckId: number): NegateRow[] => {
  return db
    .prepare(
      `SELECT n.id, n.target_deck_id,
              n.negate_card_id, nc.name AS negate_card_name, nc.image_url_small AS negate_card_image_url_small,
              n.target_card_id, tc.name AS target_card_name, tc.image_url_small AS target_card_image_url_small,
              n.note
       FROM negates n
       JOIN cards nc ON n.negate_card_id = nc.id
       JOIN cards tc ON n.target_card_id = tc.id
       WHERE n.target_deck_id = ?
       ORDER BY tc.name`
    )
    .all(deckId) as NegateRow[]
}

export const createNegate = (
  targetDeckId: number,
  negateCardId: number,
  targetCardId: number,
  note?: string
): number => {
  const result = db
    .prepare(
      `INSERT INTO negates (target_deck_id, negate_card_id, target_card_id, note) VALUES (?, ?, ?, ?)`
    )
    .run(targetDeckId, negateCardId, targetCardId, note ?? null)
  return result.lastInsertRowid as number
}

export const deleteNegate = (id: number): void => {
  db.prepare(`DELETE FROM negates WHERE id = ?`).run(id)
}
