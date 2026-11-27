/** The portal refused the search, which it does for a holder who already has an appointment. */
export type AppointmentSearchRefusal = {
  readonly reason: string
  readonly errorId?: string
  readonly manageUrl: string
}
