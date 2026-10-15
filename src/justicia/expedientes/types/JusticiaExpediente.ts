/** One card of the Carpeta Justicia "Mis expedientes" list. */
export type JusticiaExpediente = {
  /** The card's position in the list, which the detail link names (`idExpediente`). */
  readonly index: number
  readonly procedimiento: string
  readonly organo: string
  readonly estado: string
  readonly fechaEstado: string
  readonly provincia: string
  readonly localidad: string
  readonly nig: string
}
