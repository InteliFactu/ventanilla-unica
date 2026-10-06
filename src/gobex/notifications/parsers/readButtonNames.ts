import { readAttribute } from '../../../html/readAttribute'

/** The names of every button input (image, submit, button, reset) in an HTML fragment. */
export const readButtonNames = (html: string): Set<string> =>
  new Set(
    [...html.matchAll(/<input\b[^>]*>/gi)]
      .map(([tag]) => tag)
      .filter((tag) =>
        ['image', 'submit', 'button', 'reset'].includes(
          readAttribute(tag, 'type')?.toLowerCase() ?? '',
        ),
      )
      .map((tag) => readAttribute(tag, 'name') ?? ''),
  )
