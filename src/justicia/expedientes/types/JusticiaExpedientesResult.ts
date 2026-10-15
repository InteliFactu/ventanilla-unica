import type { JusticiaExpediente } from './JusticiaExpediente'

/** What `justicia expedientes` returns. */
export type JusticiaExpedientesResult = {
  readonly expedientes: readonly JusticiaExpediente[]
  readonly notes: readonly string[]
}
