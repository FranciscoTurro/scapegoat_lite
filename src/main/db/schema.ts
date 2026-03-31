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
  `)
}
