import type { RelecParty } from './RelecParty'

/** An entity the holder represents, with the `Rep*` values the form fills for it. */
export type RelecRepresented = RelecParty & {
  readonly dboid: string
  /** `RJ` legal entity, `RF` natural person. */
  readonly personType: string
  readonly fields: Readonly<Record<string, string>>
}
