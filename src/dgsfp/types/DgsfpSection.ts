import type { DgsfpControl } from './DgsfpControl'

/** A form section with its reusable definition already resolved; empty grid cells are `null`. */
export type DgsfpSection = {
  readonly nombre: string
  readonly seccionReutilizableId?: string | undefined
  readonly lineasSeccion: readonly {
    readonly controles: readonly (DgsfpControl | null)[]
  }[]
}
