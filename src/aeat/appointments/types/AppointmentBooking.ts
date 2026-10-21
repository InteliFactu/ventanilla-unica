import type { AppointmentSlot } from './AppointmentSlot'

/** Explicit selection and contact information; listing alone never reserves. */
export type AppointmentBooking = {
  readonly slot: AppointmentSlot
  readonly email: string
  readonly phone: string
  readonly detail: string
  readonly confirm: boolean
}
