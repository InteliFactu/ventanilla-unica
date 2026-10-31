/** The new notification address requested at the DGT, validated; empty strings for the parts that do not apply. */
export type DgtAddressQuery = {
  readonly nif: string
  /** The street type as the sede names it, e.g. `CALLE`. */
  readonly tipoVia: string
  readonly via: string
  readonly numero: string
  readonly planta: string
  readonly puerta: string
  readonly cp: string
  readonly municipio: string
  readonly provincia: string
  /** The locality inside the municipality, when it differs from it. */
  readonly localidad: string
}
