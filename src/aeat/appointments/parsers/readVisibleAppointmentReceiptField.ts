import { readElementTextById } from '../../../html/parsers/readElementTextById'
import { readAttribute } from '../../../html/readAttribute'
import { isAppointmentPanelVisible } from '../validators/isAppointmentPanelVisible'
import { isHiddenAppointmentElement } from '../validators/isHiddenAppointmentElement'

/** Read a unique summary field only when it and its ancestors are visible. */
export const readVisibleAppointmentReceiptField = (
  panel: string,
  id: string,
): string => {
  const matches = [
    ...panel.matchAll(/<div\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi),
  ].filter(([tag]) => readAttribute(tag, 'id') === id)
  const field = matches[0]
  if (
    matches.length !== 1 ||
    !field ||
    isHiddenAppointmentElement(field[0]) ||
    !isAppointmentPanelVisible(panel.slice(0, field.index))
  )
    return ''
  return readElementTextById(panel.slice(field.index), id) ?? ''
}
