import type { FakeTgvi } from './FakeTgvi'
import type { TgviFakeAnswer } from './TgviFakeAnswer'
import { tgviMenuPage } from './tgviMenuPage'
import { tgviRoutes } from './tgviRoutes'

/** The synthetic answer of the TGVI endpoint a URL names; the page by default. */
export const tgviAnswerFor = (url: string, fake: FakeTgvi): TgviFakeAnswer => {
  const route = tgviRoutes(fake).find(([fragment]) => url.includes(fragment))
  return route ? route[1]() : { text: tgviMenuPage('00000000T'), headers: {} }
}
