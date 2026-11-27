import type { AppointmentSearchRefusal } from './AppointmentSearchRefusal'
import type { AppointmentSlot } from './AppointmentSlot'

/** Offered slots, or the portal's refusal to search with no slots. */
export type AppointmentSearch = {
  readonly slots: AppointmentSlot[]
  readonly refusal?: AppointmentSearchRefusal
}
