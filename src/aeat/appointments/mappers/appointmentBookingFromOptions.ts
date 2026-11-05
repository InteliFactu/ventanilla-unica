import type { CliOptions } from '../../../cli/types/CliOptions'
import { isConfirmed } from '../../../write/isConfirmed'
import type { AppointmentBooking } from '../types/AppointmentBooking'
import type { AppointmentSlot } from '../types/AppointmentSlot'
import { appointmentContactFromOptions } from './appointmentContactFromOptions'

/** Map contact values without changing the offered slot. */
export const appointmentBookingFromOptions = (
  slot: AppointmentSlot,
  options: CliOptions,
): AppointmentBooking => ({
  slot,
  confirm: isConfirmed(options),
  ...appointmentContactFromOptions(options),
})
