import db from '../db'

export const syncCards = async (startDate: string): Promise<void> => {
  const today = new Date().toISOString().split('T')[0]
  const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?startdate=${startDate}&enddate=${today}&dateregion=tcg`

  const res = await fetch(url)
  const json = await res.json()

  if (!json.data) return // no cards in range (API returns 400 + { error: "..." })

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
    json.data.map((card: Record<string, any>) => ({
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
}
