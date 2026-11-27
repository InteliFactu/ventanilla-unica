import { formatAppointmentDate } from '../formatters/formatAppointmentDate'
import { readAppointmentReceiptPanel } from '../parsers/readAppointmentReceiptPanel'
import { readVisibleAppointmentReceiptField } from '../parsers/readVisibleAppointmentReceiptField'
import type { AppointmentQuery } from '../types/AppointmentQuery'
import type { AppointmentSlot } from '../types/AppointmentSlot'

/** Recognize the submitted appointment's success panel and its bound summary fields. */
export const isAppointmentReceiptConfirmed = (
  html: string,
  query: AppointmentQuery,
  slot: AppointmentSlot,
): boolean => {
  const summary = readAppointmentReceiptPanel(html)
  const address = slot.address.trim().toUpperCase()
  if (summary === undefined || address === '') return false
  const applicant = readVisibleAppointmentReceiptField(
    summary,
    'PnlResumenCitaDefInteresado',
  )
  const schedule = readVisibleAppointmentReceiptField(
    summary,
    'PnlResumenCitaDefFechaYHora',
  )
  const place = readVisibleAppointmentReceiptField(
    summary,
    'PnlResumenCitaDefLugar',
  )
    .replace(/^Lugar de la cita\s*/i, '')
    .trim()
    .toUpperCase()
  const time = `${slot.start.slice(0, 2)}:${slot.start.slice(2)}`
  return (
    applicant.split(/[^\p{L}\p{N}]+/u).includes(query.nif) &&
    schedule.includes(`${formatAppointmentDate(slot.date)} a las ${time}`) &&
    place === address
  )
}
