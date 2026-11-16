/** What the send request is built from: the reply form, its one recipient and the HTML body. */
export type RayuelaReplySendInput = {
  readonly form: Readonly<Record<string, unknown>>
  readonly recipientId: string
  readonly html: string
}
