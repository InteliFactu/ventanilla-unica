import type { DgsfpFieldValue } from './DgsfpFieldValue'

/** A section's values as the page's `ValoresSeccion` holds them. */
export type DgsfpSectionValues = {
  readonly lineasSeccion: readonly {
    readonly campos: readonly (DgsfpFieldValue | null)[]
  }[]
  readonly visible: boolean
  readonly nombre: string
}
