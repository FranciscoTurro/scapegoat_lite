import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { rivalRoute } from './routes/rival-tracker'
import { negatesRoute } from './routes/negates'
import { deckNegatesRoute } from './routes/negates/deck-negates'
import { calculatorRoute } from './routes/calculator'
import { combosRoute } from './routes/combos'
import { comboDetailRoute } from './routes/combos/combo-detail'

const routeTree = rootRoute.addChildren([indexRoute, rivalRoute, negatesRoute, deckNegatesRoute, calculatorRoute, combosRoute, comboDetailRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
