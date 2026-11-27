import { appointmentManagementUrl } from '../appointmentManagementUrl'
import type { AppointmentSlot } from '../types/AppointmentSlot'
import { parseAppointmentSlot } from './parseAppointmentSlot'

/** Read offered slots, refusing unknown pages instead of reporting false availability. */
export const parseAppointmentSlots = (html: string): AppointmentSlot[] => {
  if (
    !html.includes('Citas sugeridas') ||
    html.includes('provincia indicada no')
  )
    // A holder with an existing booking got this page on 2026-10-28; its
    // layout was not captured, so only the management page is suggested.
    throw new Error(
      `AEAT appointment search did not return a valid offer page; if the holder already has an appointment, review it at ${appointmentManagementUrl}`,
    )
  const slots = [
    ...html.matchAll(/onClickMarcarDiaHora\(this,(\{[\s\S]*?\})\)/gu),
  ].map((match) => parseAppointmentSlot(match[1] ?? ''))
  if (slots.length === 0 && !/no (?:hay|existen)|sin citas/iu.test(html))
    throw new Error('AEAT appointment offer layout is not recognized')
  return slots
}
