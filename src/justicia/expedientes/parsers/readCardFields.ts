import { htmlToText } from '../../../html/htmlToText'

/** The `cj-card__key` / `cj-card__val` pairs of one card, keyed without the trailing colon. */
export const readCardFields = (card: string): ReadonlyMap<string, string> =>
  new Map(
    [
      ...card.matchAll(
        /cj-card__key">([\s\S]*?)<\/span>\s*<span[^>]*cj-card__val">([\s\S]*?)<\/span>/g,
      ),
    ].map((pair) => [
      htmlToText(pair[1] ?? '').replace(/:$/, ''),
      htmlToText(pair[2] ?? ''),
    ]),
  )
