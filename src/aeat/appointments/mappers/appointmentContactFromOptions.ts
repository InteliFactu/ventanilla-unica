import type { CliOptions } from '../../../cli/types/CliOptions'
import type { AppointmentContact } from '../types/AppointmentContact'

/** Read the contact values a confirmed booking sends, defaulting to empty. */
export const appointmentContactFromOptions = (
  options: CliOptions,
): AppointmentContact => ({
  email: options['email'] ?? '',
  phone: options['telefono'] ?? '',
  detail: options['detalle'] ?? '',
})
