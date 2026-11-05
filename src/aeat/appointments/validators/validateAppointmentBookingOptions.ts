import type { CliOptions } from '../../../cli/types/CliOptions'
import { appointmentContactFromOptions } from '../mappers/appointmentContactFromOptions'
import { validateAppointmentContact } from './validateAppointmentContact'

/** Refuse a confirmed booking's options before the first portal request. */
export const validateAppointmentBookingOptions = (
  options: CliOptions,
): void => {
  if (!options['out'])
    throw new Error('--out is required to preserve a booking response')
  validateAppointmentContact(appointmentContactFromOptions(options))
}
