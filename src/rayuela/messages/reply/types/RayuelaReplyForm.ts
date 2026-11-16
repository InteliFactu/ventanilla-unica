/** What the portal's reply form holds before anything is typed: the subject, the one recipient and the raw template data. */
export type RayuelaReplyForm = {
  readonly subject: string
  readonly recipientId: string
  readonly recipientName: string
  readonly config: Readonly<Record<string, unknown>>
}
