/** A final request response still needs receipt inspection before claiming a reservation. */
export type AppointmentBookingResult = {
  readonly executed: boolean
  readonly html?: string
}
