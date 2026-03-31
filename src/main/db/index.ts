import Database, { type Database as DB } from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

const db: DB = new Database(join(app.getPath('userData'), 'app.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export default db
