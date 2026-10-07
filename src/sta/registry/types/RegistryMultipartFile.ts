/** The file part of a multipart registry upload. */
export type RegistryMultipartFile = {
  readonly field: string
  readonly name: string
  readonly type: string
  readonly bytes: Buffer
}
