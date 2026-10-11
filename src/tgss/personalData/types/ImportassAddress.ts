/** The domicile Importass holds, as its "Modificar" form carries it, plus the lines it displays. */
export type ImportassAddress = {
  readonly lines: readonly string[]
  /** INE country code; `724` is Spain. */
  readonly pais: string
  /** `AV`, `CL`, `CT`, `PP`, `PZ` or `ZZ` (otros). */
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
