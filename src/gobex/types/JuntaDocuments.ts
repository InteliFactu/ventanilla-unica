import type { GobexRecord } from './GobexRecord'

/** The documents the holder filed through the Junta's registry. */
export type JuntaDocuments = {
  readonly documents: readonly GobexRecord[]
}
