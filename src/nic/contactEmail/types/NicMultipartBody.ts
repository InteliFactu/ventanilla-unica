/** A multipart request body and the content type carrying its boundary. */
export type NicMultipartBody = {
  readonly body: Buffer
  readonly contentType: string
}
