/** The billing street address and postal code; absent in a plan run without them. */
export type NotaAddress = {
  readonly direccion: string | undefined
  readonly codigoPostal: string | undefined
}
