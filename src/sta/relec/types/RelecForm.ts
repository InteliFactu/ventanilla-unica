import type { RelecAddress } from './RelecAddress'
import type { RelecContact } from './RelecContact'
import type { RelecParty } from './RelecParty'
import type { RelecRepresented } from './RelecRepresented'

/** What the TramitaForm page carries that the submission needs. */
export type RelecForm = {
  /** The `<input>` values of the TramitaSign form as served. */
  readonly fields: Readonly<Record<string, string>>
  readonly holder: RelecParty
  readonly represented: readonly RelecRepresented[]
  readonly contact: RelecContact
  readonly address: RelecAddress
  /** The first street type of the represented's (empty) address select. */
  readonly defaultStreetType: string
}
