import db from '../db'

export const getCardById = (id: number) => {
  return db.prepare('SELECT * FROM cards WHERE id = ?').get(id)
}

export const getCardByName = (name: string) => {
  return db.prepare('SELECT * FROM cards WHERE name = ?').get(name)
}

export const getAllCardNames = (): string[] => {
  const rows = db.prepare('SELECT name FROM cards ORDER BY name').all() as { name: string }[]
  return rows.map((r) => r.name)
}
