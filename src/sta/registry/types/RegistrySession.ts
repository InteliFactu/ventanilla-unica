/** A general-registry draft opened for the holder: where the API lives and which draft every call belongs to. */
export type RegistrySession = {
  readonly origin: string
  readonly procedureId: string
  /** The draft UUID the SPA carries in its URL and in every request body. */
  readonly reference: string
}
