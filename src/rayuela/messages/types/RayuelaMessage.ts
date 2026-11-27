export type RayuelaMessage = {
  readonly id: string
  readonly from: string
  readonly subject: string
  readonly body: string
  readonly dateText: string
  /** ISO calendar date inferred from `dateText`, or null for an unknown label. */
  readonly date: string | null
  readonly hasAttachments: boolean
}
