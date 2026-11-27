import type { MoneyAmount } from '../../money/types/MoneyAmount'

/** Fields read from one DetalleDda page; each is undefined when its label was not present. */
export type DebtDetail = {
  readonly fechaLiquidacion?: string | undefined
  /** Voluntary-payment deadline reported by AEAT, in YYYY-MM-DD format. */
  readonly fechaLimiteVoluntaria?: string
  readonly importeDeuda?: MoneyAmount | undefined
  readonly cancelado?: MoneyAmount | undefined
  readonly principalHoy?: MoneyAmount | undefined
  readonly interesesHoy?: MoneyAmount | undefined
  readonly totalHoy?: MoneyAmount | undefined
}
