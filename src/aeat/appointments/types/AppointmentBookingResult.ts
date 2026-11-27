/** Separate the final submission from a confirmation recognized in its receipt. */
export type AppointmentBookingResult = {
  readonly executed: boolean
  readonly html?: string
  readonly confirmed?: boolean
}
