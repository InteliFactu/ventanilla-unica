/** What `documents/` answers for an upload, and what the entry lists in `attachments`. */
export type RegAttachment = {
  readonly uuid: string
  readonly name: string
  readonly contentType: string
  readonly size: number
  readonly mimeType: string
  readonly voucher: boolean
  readonly description: string
}
