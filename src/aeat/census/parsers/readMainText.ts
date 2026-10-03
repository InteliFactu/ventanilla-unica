import { htmlToText } from '../../../html/htmlToText'

/** The text of a sede page's `<main>` block (the whole page when it has none), without the header and menus around it. */
export const readMainText = (html: string): string =>
  htmlToText(/<main[\s>][\s\S]*?<\/main>/i.exec(html)?.[0] ?? html)
