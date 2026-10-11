/** A DGT notification address, as the ATEX service holds it. */
export type DgtAddress = {
  readonly tipoVia: string
  readonly via: string
  readonly numero: string
  readonly planta: string
  readonly puerta: string
  readonly escalera: string
  readonly cp: string
  readonly municipio: string
  readonly provincia: string
  /** One line, as a reader would write it. */
  readonly texto: string
}
