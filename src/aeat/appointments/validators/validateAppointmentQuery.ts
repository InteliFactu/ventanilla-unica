import type { AppointmentQuery } from '../types/AppointmentQuery'

/** Reject malformed search parameters before starting a portal session. */
export const validateAppointmentQuery = (query: AppointmentQuery): void => {
  if (
    !/^[\dA-Z]{9}$/u.test(query.nif) ||
    query.name.trim().length === 0 ||
    !/^\d{5}$/u.test(query.postalCode) ||
    !/^\d{4}-\d{2}-\d{2}$/u.test(query.date) ||
    Number.isNaN(Date.parse(query.date)) ||
    !/^(?:09|1\d|20):[0-5]\d$/u.test(query.time) ||
    !/^[A-Z]\d{6}$/u.test(query.service)
  )
    throw new Error(
      'Provide --nif, --nombre, --postal, --fecha YYYY-MM-DD and --hora HH:MM',
    )
  if (new Date(query.date).toISOString().slice(0, 10) !== query.date)
    throw new Error('Appointment date does not exist')
}
