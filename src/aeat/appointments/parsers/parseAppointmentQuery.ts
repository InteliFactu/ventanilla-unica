import type { CliOptions } from '../../../cli/types/CliOptions'
import type { AppointmentQuery } from '../types/AppointmentQuery'
import { validateAppointmentQuery } from '../validators/validateAppointmentQuery'

/** Parse explicit CLI search bounds. */
export const parseAppointmentQuery = (
  options: CliOptions,
): AppointmentQuery => {
  const query = {
    nif: options['nif'] ?? '',
    name: options['nombre'] ?? '',
    postalCode: options['postal'] ?? '',
    date: options['fecha'] ?? '',
    time: options['hora'] ?? '',
    service: options['servicio'] ?? 'C324163',
  }
  validateAppointmentQuery(query)
  return query
}
