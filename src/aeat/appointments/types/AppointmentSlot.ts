/** One offered appointment, identified by the portal's own codes. */
export type AppointmentSlot = {
  readonly centre: string
  readonly date: string
  readonly start: string
  readonly end: string
  readonly service: string
  readonly address: string
  readonly kind: string
}
