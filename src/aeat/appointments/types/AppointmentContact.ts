import type { AppointmentBooking } from './AppointmentBooking'

/** The contact details the final reservation request carries. */
export type AppointmentContact = Pick<
  AppointmentBooking,
  'email' | 'phone' | 'detail'
>
