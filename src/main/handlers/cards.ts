import db from '../db'

export const getCardById = (id: number) => {
  return db.prepare('SELECT * FROM cards WHERE id = ?').get(id)
}

export const getCardByName = (name: string) => {
  return db.prepare('SELECT * FROM cards WHERE name = ?').get(name)
}

export const getCardsByName = (name: string) => {
  return db.prepare('SELECT * FROM cards WHERE name = ?').all(name)
}

export const getAllCardNames = (): string[] => {
  const rows = db.prepare('SELECT name FROM cards ORDER BY name').all() as { name: string }[]
  return rows.map((r) => r.name)
}

export const getAllCardsBasic = (): { name: string; type: string }[] => {
  return db.prepare('SELECT name, type FROM cards ORDER BY name').all() as { name: string; type: string }[]
}
