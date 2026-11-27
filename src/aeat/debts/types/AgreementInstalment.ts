import type { MoneyAmount } from '../../money/types/MoneyAmount'

/** A SRAF instalment at query time. Paid instalments no longer show their original amount here. */
export type AgreementInstalment = {
  readonly debtKey: string
  readonly number: number
  readonly phase: string
  readonly dueDate: string
  readonly pending: MoneyAmount
  readonly interest: MoneyAmount
  readonly total: MoneyAmount
  readonly paid: boolean
}
