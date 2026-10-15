/** One document of an expediente as the Atenea IRIS visor lists it. */
export type JusticiaDocument = {
  readonly id: string
  readonly numero: string
  readonly titulo: string
  readonly tipo: string
  /** The event date (`fechaAcontecimiento`) as YYYY-MM-DD, empty when the visor gives none. */
  readonly fecha: string
  readonly carpeta: string
  readonly codigoBarras: string
  readonly accesible: boolean
  /** Set when `--out` saved the file. */
  readonly path?: string | undefined
  readonly bytes?: number | undefined
}
