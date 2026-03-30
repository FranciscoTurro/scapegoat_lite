import { sql } from 'drizzle-orm'
import { db } from '../db'
import { cards } from '../db/schema'

export const initDb = async () => {
  const count = db.get<{ count: number }>(sql`SELECT COUNT(*) as count FROM cards`)
  if (count?.count === 0) {
    const res = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
    const json = await res.json()

    console.log('tes')

    db.insert(cards)
      .values(
        json.map(
          (card) =>
            ({
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
            }) satisfies typeof cards.$inferInsert
        )
      )
      .onConflictDoNothing()
      .run()
  }
}
