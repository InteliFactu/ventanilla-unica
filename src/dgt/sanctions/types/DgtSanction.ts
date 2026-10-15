/** One fine as "Mis sanciones" lists it, with its detail page's fields and, with `--out`, the saved PDF. */
export type DgtSanction = {
  readonly expediente: string
  /** The list's grouping ("Terminadas", ...). */
  readonly asunto: string
  readonly estado: string
  /** ISO date of the denuncia. */
  readonly fechaDenuncia: string
  readonly provincia: string
  readonly importe: string
  /** Every label and value of the detail page (Denunciado, Pagado, Reglamento, Hecho catalogado...). */
  readonly detalle?: Readonly<Record<string, string>> | undefined
  readonly path?: string | undefined
}
