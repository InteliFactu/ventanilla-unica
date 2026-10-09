/**
 * The `apordoc` block of a contribution to an open file: the `dboid` of the
 * expediente as `/people/info/expedientes` lists it, and the optional
 * "Información adicional" text.
 */
export type RegistryContributionTarget = {
  readonly expId: string
  readonly aditionalInfo?: string | undefined
}
