import type { AeatPower } from './AeatPower'
import type { AeatPowerDirection } from './AeatPowerDirection'

/** The holder's apoderamientos in one direction, as the Registro de apoderamientos lists them. */
export type AeatPowersReport = {
  readonly nif: string
  readonly direction: AeatPowerDirection
  readonly count: number
  readonly powers: readonly AeatPower[]
}
