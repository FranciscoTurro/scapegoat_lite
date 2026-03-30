import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const cards = sqliteTable('cards', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  humanReadableCardType: text('human_readable_card_type'),
  desc: text('desc').notNull(),
  race: text('race').notNull(),
  archetype: text('archetype'),

  atk: integer('atk'),
  def: integer('def'),
  level: integer('level'),
  attribute: text('attribute'),

  linkval: integer('linkval'),

  imageUrl: text('image_url').notNull(),
  imageUrlSmall: text('image_url_small').notNull()
})

export const decks = sqliteTable('decks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  coverCardId: integer('cover_card_id').references(() => cards.id)
})

export const negates = sqliteTable('negates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  targetDeckId: integer('target_deck_id')
    .notNull()
    .references(() => decks.id),
  negateCardId: integer('negate_card_id')
    .notNull()
    .references(() => cards.id),
  targetCardId: integer('target_card_id')
    .notNull()
    .references(() => cards.id),
  note: text('note')
})

export const cardsRelations = relations(cards, ({ many }) => ({
  negateProviders: many(negates, { relationName: 'negateProvider' }),
  negateTargets: many(negates, { relationName: 'negateTarget' })
}))

export const decksRelations = relations(decks, ({ many, one }) => ({
  negates: many(negates),
  cover: one(cards, {
    fields: [decks.coverCardId],
    references: [cards.id]
  })
}))

export const negatesRelations = relations(negates, ({ one }) => ({
  deck: one(decks, {
    fields: [negates.targetDeckId],
    references: [decks.id]
  }),
  myNegate: one(cards, {
    fields: [negates.negateCardId],
    references: [cards.id],
    relationName: 'negateProvider'
  }),
  theirCard: one(cards, {
    fields: [negates.targetCardId],
    references: [cards.id],
    relationName: 'negateTarget'
  })
}))
