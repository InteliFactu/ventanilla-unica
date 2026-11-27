import type { AppointmentMarkupAncestor } from '../types/AppointmentMarkupAncestor'
import { isHiddenAppointmentElement } from './isHiddenAppointmentElement'

/** The captured receipt panel is visible only outside a hidden ancestor. */
export const isAppointmentPanelVisible = (prefix: string): boolean => {
  const opened: AppointmentMarkupAncestor[] = []
  for (const [token, slash = '', raw = ''] of prefix.matchAll(
    /<(\/?)([a-z][\w-]*)(?=[\s/>])(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi,
  )) {
    const name = raw.toLowerCase()
    if (slash) {
      const index = opened.findLastIndex((entry) => entry.name === name)
      if (index >= 0) opened.length = index
      continue
    }
    if (
      /^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(
        name,
      ) ||
      token.endsWith('/>')
    )
      continue
    opened.push({ name, hidden: isHiddenAppointmentElement(token) })
  }
  return !opened.some((entry) => entry.hidden)
}
