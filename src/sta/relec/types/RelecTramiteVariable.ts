import type { RelecVariable } from './RelecVariable'

/** A value the holder supplied for a dynamic field on the chosen procedure. */
export type RelecTramiteVariable = RelecVariable & { readonly value: string }
