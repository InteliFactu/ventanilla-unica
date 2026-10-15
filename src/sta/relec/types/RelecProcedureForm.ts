import type { RelecSlot } from './RelecSlot'
import type { RelecVariable } from './RelecVariable'

/** What a procedure's Relec form asks for, read without filing anything. */
export type RelecProcedureForm = {
  readonly host: string
  readonly dboid: string
  readonly procedure: string
  readonly variables: readonly RelecVariable[]
  readonly slots: readonly RelecSlot[]
}
