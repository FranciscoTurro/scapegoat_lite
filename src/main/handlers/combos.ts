import db from '../db'

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

export const getAllCombos = (): ComboRow[] => {
  return db
    .prepare(
      `SELECT co.id, co.name, co.cover_card_id,
              c.image_url AS cover_card_image_url,
              c.image_url_small AS cover_card_image_url_small
       FROM combos co
       LEFT JOIN cards c ON co.cover_card_id = c.id
       ORDER BY co.name`
    )
    .all() as ComboRow[]
}

export const createCombo = (name: string, coverCardId: number | null): number => {
  const result = db
    .prepare(`INSERT INTO combos (name, cover_card_id) VALUES (?, ?)`)
    .run(name, coverCardId)
  return result.lastInsertRowid as number
}

export const updateCombo = (id: number, name: string, coverCardId: number | null): void => {
  db.prepare(`UPDATE combos SET name = ?, cover_card_id = ? WHERE id = ?`).run(name, coverCardId, id)
}

export const deleteCombo = (id: number): void => {
  db.prepare(`DELETE FROM combo_steps WHERE combo_id = ?`).run(id)
  db.prepare(`DELETE FROM combos WHERE id = ?`).run(id)
}

export const getStepsForCombo = (comboId: number): ComboStepRow[] => {
  return db
    .prepare(
      `SELECT cs.id, cs.combo_id, cs.position, cs.card_id,
              c.name AS card_name, c.image_url_small AS card_image_url_small,
              cs.note, cs.link_comment
       FROM combo_steps cs
       JOIN cards c ON cs.card_id = c.id
       WHERE cs.combo_id = ?
       ORDER BY cs.position`
    )
    .all(comboId) as ComboStepRow[]
}

export const addComboStep = (
  comboId: number,
  cardId: number,
  note: string | null,
  linkComment: string | null,
  position: number
): number => {
  const result = db
    .prepare(
      `INSERT INTO combo_steps (combo_id, card_id, note, link_comment, position) VALUES (?, ?, ?, ?, ?)`
    )
    .run(comboId, cardId, note ?? null, linkComment ?? null, position)
  return result.lastInsertRowid as number
}

export const deleteComboStep = (id: number): void => {
  db.prepare(`DELETE FROM combo_steps WHERE id = ?`).run(id)
}

export const updateComboStepNote = (id: number, note: string | null): void => {
  db.prepare(`UPDATE combo_steps SET note = ? WHERE id = ?`).run(note ?? null, id)
}

export const updateComboStepLink = (id: number, linkComment: string | null): void => {
  db.prepare(`UPDATE combo_steps SET link_comment = ? WHERE id = ?`).run(linkComment ?? null, id)
}

export const reorderComboSteps = (orderedIds: number[]): void => {
  const update = db.prepare(`UPDATE combo_steps SET position = ? WHERE id = ?`)
  const run = db.transaction(() => {
    orderedIds.forEach((id, index) => update.run(index, id))
  })
  run()
}
