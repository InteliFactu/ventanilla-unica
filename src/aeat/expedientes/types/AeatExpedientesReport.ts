import type { AeatExpediente } from './AeatExpediente'

export type AeatExpedientesReport = {
  readonly nif: string
  readonly count: number
  readonly expedientes: readonly AeatExpediente[]
  readonly coverage: string
}
