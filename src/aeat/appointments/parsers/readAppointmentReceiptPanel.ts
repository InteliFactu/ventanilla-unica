import { htmlToText } from '../../../html/htmlToText'
import { isAppointmentPanelVisible } from '../validators/isAppointmentPanelVisible'
import { readBalancedAppointmentPanel } from './readBalancedAppointmentPanel'

/** Read the success panel from the final receipt structure evidenced by the portal. */
export const readAppointmentReceiptPanel = (
  html: string,
): string | undefined => {
  const active = html.replaceAll(
    /<!--[\s\S]*?-->|<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi,
    '',
  )
  const panel =
    /<div\s+class=(["'])alert alert-light-success panel-resumen\1\s*>\s*<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(
      active,
    )
  if (
    !panel ||
    htmlToText(panel[2] ?? '') !== 'Su cita ha sido confirmada' ||
    !isAppointmentPanelVisible(active.slice(0, panel.index))
  )
    return undefined
  return readBalancedAppointmentPanel(active.slice(panel.index))
}
