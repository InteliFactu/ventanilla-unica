/** A Spanish domicile as the Importass form takes it; empty strings for the parts that do not apply. */
export type AddressUpdate = {
  readonly tipoVia: string
  readonly nombreVia: string
  readonly numero: string
  readonly bis: string
  readonly bloque: string
  readonly escalera: string
  readonly piso: string
  readonly puerta: string
  readonly codigoPostal: string
  readonly localidad: string
}
