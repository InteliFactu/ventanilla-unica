import type { AppointmentSlot } from '../types/AppointmentSlot'
import { parseAppointmentSlot } from './parseAppointmentSlot'

/** Read offered slots, refusing unknown pages instead of reporting false availability. */
export const parseAppointmentSlots = (html: string): AppointmentSlot[] => {
  if (
    !html.includes('Citas sugeridas') ||
    html.includes('provincia indicada no')
  )
    throw new Error('AEAT appointment search did not return a valid offer page')
  const slots = [
    ...html.matchAll(/onClickMarcarDiaHora\(this,(\{[\s\S]*?\})\)/gu),
  ].map((match) => parseAppointmentSlot(match[1] ?? ''))
  if (slots.length === 0 && !/no (?:hay|existen)|sin citas/iu.test(html))
    throw new Error('AEAT appointment offer layout is not recognized')
  return slots
}
