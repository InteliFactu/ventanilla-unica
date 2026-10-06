import type { GobexRecord } from '../../types/GobexRecord'

/** One row of the Carpeta Ciudadana notification grid and the JSF command link that opens it. */
export type CarpetaNotificationRow = {
  readonly record: GobexRecord
  /** The `jsfcljs` parameter the row's action link posts; undefined when the row has no link. */
  readonly link: string | undefined
}
