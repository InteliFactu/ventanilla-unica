/** A file named in the register request (`ValorFicheroConNombre`). */
export type DgsfpAttachedFile = {
  readonly titulo: string
  readonly descripcion: string
  readonly nombreArchivo: string
  readonly hash: string
  readonly nombreCampo: string
  readonly index: number
  readonly documentosExtranet: readonly never[]
}
