import type { Model303Page } from '../types/Model303Page'
import type { Model303PageLayout } from '../types/Model303PageLayout'

/** Consume exact page lengths so embedded or inconsistent tags cannot alter boundaries. */
export const parseModel303Pages = (
  body: string,
  layouts: readonly Model303PageLayout[],
): readonly Model303Page[] => {
  const pages: Model303Page[] = []
  for (let offset = 0; offset < body.length;) {
    const layout = layouts.find(({ tag }) =>
      body.startsWith(`<T303${tag}>`, offset),
    )
    if (layout === undefined)
      throw new Error(
        `Modelo 303: unknown page at file position ${String(329 + offset)}`,
      )
    const page = body.slice(offset, offset + layout.length)
    if (page.length !== layout.length || !page.endsWith(`</T303${layout.tag}>`))
      throw new Error(
        `Modelo 303: page ${layout.tag} must have ${String(layout.length)} positions and a matching end tag`,
      )
    pages.push({ layout, text: page })
    offset += layout.length
  }
  return pages
}
