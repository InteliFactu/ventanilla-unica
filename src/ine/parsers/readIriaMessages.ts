import { unescapeHtml } from '../../html/unescapeHtml'

/** The PrimeFaces message summaries (errors and confirmations) a page or partial response carries. */
export const readIriaMessages = (html: string): string[] =>
  [
    ...html.matchAll(
      /<span class="ui-messages-(?:error|info|warn)-summary">([^<]*)<\/span>/gi,
    ),
  ]
    .map(([, text]) => unescapeHtml(text ?? '').trim())
    .filter((text) => text.length > 0)
