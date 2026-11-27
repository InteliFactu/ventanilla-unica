import type { MoneyAmount } from '../../money/types/MoneyAmount'

/**
 * Fields read from one AcuAccDeta page: the named ones the notes pin down, plus
 * every liquidation key it mentions and the legacy raw table cells. These
 * cells may describe agreement debts instead of individual instalments.
 */
export type AgreementDetail = {
  readonly estado?: string | undefined
  readonly resolucion?: string | undefined
  readonly importe?: MoneyAmount | undefined
  readonly notificado?: string | undefined
  readonly plazos?: string | undefined
  readonly primerPlazo?: string | undefined
  readonly deudas: readonly string[]
  readonly instalments: readonly (readonly string[])[]
}
