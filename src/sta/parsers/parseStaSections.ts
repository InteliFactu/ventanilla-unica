import { htmlToText } from '../../html/htmlToText'
import type { StaSections } from '../types/StaSections'

/**
 * The labelled entries of every section of an STA data page: each
 * `<h4 class="title4">` title and the `entry-label`/`entry-value` pairs that
 * follow it, up to the next title, as text.
 */
export const parseStaSections = (html: string): StaSections =>
  Object.fromEntries(
    html
      .split(/<h4 class="title4[^"]*">/)
      .slice(1)
      .map((chunk) => {
        const [title = '', body = ''] = chunk.split('</h4>')
        const entries = [
          ...body.matchAll(
            /<dt class="entry-label[^"]*">([\s\S]*?)<\/dt>\s*<dd class="entry-value[^"]*">([\s\S]*?)<\/dd>/g,
          ),
        ].map(([, label = '', value = '']) => [
          htmlToText(label),
          htmlToText(value),
        ])
        return [htmlToText(title), Object.fromEntries(entries)]
      }),
  )
