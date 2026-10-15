import type { StaGateButton } from '../types/StaGateButton'

/**
 * The buttons of the contact-data gate, page or `submitAjax.aa` zone: each is
 * an `a.ui-btn` whose onclick calls
 * `callWidgetEventExecuteOn('<screen>', '<object>', '<action>', ...)`.
 * sede.oargt.es adds attributes after the onclick and wraps the label in
 * one more span.
 */
export const parseGateButtons = (html: string): readonly StaGateButton[] =>
  [
    ...html.matchAll(
      /callWidgetEventExecuteOn\('([^']*)', '([^']*)', '([^']*)'[^"]*"[^>]*>\s*(?:<span>\s*)?<span class="a-text">([^<]*)<\/span>/g,
    ),
  ].map((match) => ({
    screenId: match[1] ?? '',
    object: match[2] ?? '',
    action: match[3] ?? '',
    label: (match[4] ?? '').trim(),
  }))
