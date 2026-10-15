import { unescapeHtml } from '../../../html/unescapeHtml'

/** The detail page's fields: each `<h4 class="col subtitle">` label and the `<p>` that follows it. */
export const parseSanctionDetail = (
  html: string,
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    [
      ...html.matchAll(
        /<h4 class="col subtitle">([^<]+)<\/h4>\s*<\/div>\s*<p[^>]*>([\s\S]*?)<\/p>/g,
      ),
    ].map(([, label = '', value = '']) => [
      unescapeHtml(label).trim(),
      unescapeHtml(value).replaceAll(/\s+/g, ' ').trim(),
    ]),
  )
