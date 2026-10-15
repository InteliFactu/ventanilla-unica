/** `registry/?certificate=true`: the new entry and the base64 summary to sign. */
export type CreatedRegEntry = {
  readonly uuid: string
  readonly xmlSummary: string
}
