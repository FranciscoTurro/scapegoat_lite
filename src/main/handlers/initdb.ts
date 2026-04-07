import db from '../db'
import { initSchema } from '../db/schema'

export const initDb = async () => {
  initSchema()

  const { count } = db.prepare('SELECT COUNT(*) as count FROM cards').get() as { count: number }
  if (count > 0) return

  const res = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
  const json = await res.json()
  const cards = json.data

  const insert = db.prepare(`
    INSERT OR IGNORE INTO cards
      (id, name, type, human_readable_card_type, desc, race, archetype, atk, def, level, attribute, linkval, image_url, image_url_small)
    VALUES
      (@id, @name, @type, @humanReadableCardType, @desc, @race, @archetype, @atk, @def, @level, @attribute, @linkval, @imageUrl, @imageUrlSmall)
  `)

  const insertMany = db.transaction((rows) => {
    for (const card of rows) insert.run(card)
  })

  insertMany(
    cards.map((card: Record<string, any>) => ({
      id: card.id,
      name: card.name,
      type: card.type,
      humanReadableCardType: card.humanReadableCardType ?? null,
      desc: card.desc,
      race: card.race,
      archetype: card.archetype ?? null,
      atk: card.atk ?? null,
      def: card.def ?? null,
      level: card.level ?? null,
      attribute: card.attribute ?? null,
      linkval: card.linkval ?? null,
      imageUrl: card.card_images[0].image_url,
      imageUrlSmall: card.card_images[0].image_url_small
    }))
  )

  const today = new Date().toISOString().split('T')[0]
  db.prepare('UPDATE sync_info SET last_sync = ? WHERE id = 1').run(today)
}
