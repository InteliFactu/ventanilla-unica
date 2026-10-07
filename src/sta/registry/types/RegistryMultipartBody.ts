/** A multipart body and the content type carrying its boundary. */
export type RegistryMultipartBody = {
  readonly body: Buffer
  readonly contentType: string
}
