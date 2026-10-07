import type { AeatExpedienteAct } from './AeatExpedienteAct'

export type AeatExpediente = {
  readonly reference: string
  readonly procedure: string
  readonly period: string
  readonly status: string
  readonly lastActionDate: string
  readonly startDate: string | null
  readonly endDate: string | null
  readonly acts: readonly AeatExpedienteAct[]
  readonly detailUrl: string
}
