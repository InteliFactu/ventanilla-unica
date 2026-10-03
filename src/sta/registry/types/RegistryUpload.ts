/** One stored file as the upload answers it; the request body lists it back with its order and group. */
export type RegistryUpload = {
  readonly id: string
  readonly hash: string
  readonly size: number
  readonly name: string
  readonly mimeType: string
}
