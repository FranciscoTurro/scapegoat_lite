import db from '.'

export const initSchema = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      human_readable_card_type TEXT,
      desc TEXT NOT NULL,
      race TEXT NOT NULL,
      archetype TEXT,
      atk INTEGER,
      def INTEGER,
      level INTEGER,
      attribute TEXT,
      linkval INTEGER,
      image_url TEXT NOT NULL,
      image_url_small TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cover_card_id INTEGER REFERENCES cards(id)
    );

    CREATE TABLE IF NOT EXISTS negates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_deck_id INTEGER NOT NULL REFERENCES decks(id),
      negate_card_id INTEGER NOT NULL REFERENCES cards(id),
      target_card_id INTEGER NOT NULL REFERENCES cards(id),
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS combos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cover_card_id INTEGER REFERENCES cards(id)
    );

    CREATE TABLE IF NOT EXISTS combo_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      combo_id INTEGER NOT NULL REFERENCES combos(id),
      position INTEGER NOT NULL,
      card_id INTEGER NOT NULL REFERENCES cards(id),
      note TEXT,
      link_comment TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_info (
      id INTEGER PRIMARY KEY,
      last_sync TEXT
    );

    INSERT OR IGNORE INTO sync_info (id, last_sync) VALUES (1, NULL);
  `)

  // Migrations for existing installs
  const cols = (
    db.prepare('PRAGMA table_info(combo_steps)').all() as { name: string }[]
  ).map((c) => c.name)

  if (cols.includes('comment') && !cols.includes('note')) {
    db.exec('ALTER TABLE combo_steps RENAME COLUMN comment TO note')
  }
  if (!cols.includes('link_comment')) {
    db.exec('ALTER TABLE combo_steps ADD COLUMN link_comment TEXT')
  }
}
