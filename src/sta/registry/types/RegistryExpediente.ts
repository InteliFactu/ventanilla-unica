/** One open expediente of a party as `POST /people/info/expedientes` lists it. */
export type RegistryExpediente = {
  readonly dboid: string
  readonly numExp: string
  readonly procedure?: string | null | undefined
}
