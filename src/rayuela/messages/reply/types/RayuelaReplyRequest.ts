/** One reply to send: the inbox message id and the plain-text body. */
export type RayuelaReplyRequest = {
  readonly messageId: string
  readonly body: string
  readonly confirm: boolean
}
