/** One alert group of the Carpeta calendar: its level (the id the save takes), whether it mails or pushes, and the notice days. */
export type AlertGroup = {
  readonly level: number | null
  readonly name: string
  readonly email: boolean
  readonly push: boolean
  readonly firstNotice: number | null
  readonly secondNotice: number | null
}
