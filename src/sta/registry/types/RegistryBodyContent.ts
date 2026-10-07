/** The parts of a registry save body: the holder, the form values, the documents and the optional notice e-mail. */
export type RegistryBodyContent = {
  readonly parties: Readonly<Record<string, unknown>>
  readonly data: readonly Readonly<Record<string, unknown>>[]
  readonly documents: readonly Readonly<Record<string, unknown>>[]
  readonly notificationEmail?: string | undefined
}
