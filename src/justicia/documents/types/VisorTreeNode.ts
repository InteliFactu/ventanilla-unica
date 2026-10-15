/** One node of the visor's document tree, as `accesoExternoEjeGetArbolByCodExpediente` answers it (only the fields read here). */
export type VisorTreeNode = {
  readonly id?: string
  readonly title?: string
  readonly isFolder?: boolean
  readonly codigoBarras?: string
  readonly tipo?: string
  readonly numeroOrden?: string
  /** Milliseconds since the epoch. */
  readonly fechaAcontecimiento?: number | null
  readonly accesible?: boolean
  readonly children?: readonly VisorTreeNode[] | null
}
