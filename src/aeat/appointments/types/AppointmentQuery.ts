/** Exact holder, service and search scope for the public AEAT appointment flow. */
export type AppointmentQuery = {
  readonly nif: string
  readonly name: string
  readonly service: string
  readonly postalCode: string
  readonly date: string
  readonly time: string
}
