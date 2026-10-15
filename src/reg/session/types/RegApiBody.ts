/** A non-JSON request body (the multipart upload) with its content type. */
export type RegApiBody = {
  readonly body: Buffer
  readonly contentType: string
}
