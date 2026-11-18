import type { Agreement } from './Agreement'
import type { Debt } from './Debt'

/** The full read-only sweep result for one NIF: its debts, agreements and totals. */
export type AeatDebtReport = {
  readonly nif: string
  readonly entity?: string | undefined
  readonly debts: readonly Debt[]
  readonly agreements: readonly Agreement[]
  /** Why `agreements` was not read, when it was not. */
  readonly agreementsNote?: string | undefined
  readonly totals: { readonly pendiente: number; readonly aIngresar: number }
  readonly hint?: string | undefined
}
