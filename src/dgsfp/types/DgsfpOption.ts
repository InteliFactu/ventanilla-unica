/** One choice of a radio-button panel and the sections it shows. */
export type DgsfpOption = {
  readonly idOpcion: string
  readonly opcion: string
  readonly seccionesRelacionadas?: readonly string[] | undefined
}
