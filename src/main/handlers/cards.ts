import db from '../db'

export const getCardById = (id: number) => {
  return db.prepare('SELECT * FROM cards WHERE id = ?').get(id)
}
