import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import * as schema from './schema'

const sqlite = new Database(join(app.getPath('userData'), 'app.db'))
console.log(join(app.getPath('userData'), 'app.db'))
export const db = drizzle(sqlite, { schema })
