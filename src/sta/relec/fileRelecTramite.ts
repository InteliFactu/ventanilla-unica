import type { HttpClient } from '../../http/types/HttpClient'
import type { StaRegistryFilingContext } from '../registry/types/StaRegistryFilingContext'
import { buildRelecTramitePairs } from './builders/buildRelecTramitePairs'
import { mapRelecInstancePlanLines } from './mappers/mapRelecInstancePlanLines'
import { prepareRelecTramite } from './prepareRelecTramite'
import { submitRelecFiling } from './submitRelecFiling'
import { trySaveRelecOutput } from './trySaveRelecOutput'
import type { RelecTramiteQuery } from './types/RelecTramiteQuery'
import type { RelecTramiteResult } from './types/RelecTramiteResult'

/** Plan by default; confirmed catalogue filings share the contribution signing pipeline. */
export const fileRelecTramite = async (
  client: HttpClient,
  query: RelecTramiteQuery,
  context: StaRegistryFilingContext,
): Promise<RelecTramiteResult> => {
  const prepared = await prepareRelecTramite(client, query, context.identity)
  const base = {
    action: 'caceres tramite',
    filing: prepared.plan,
    plan: mapRelecInstancePlanLines(prepared.plan),
  }
  if (!context.confirmed)
    return {
      ...base,
      executed: false,
      notes: [
        'Only reads ran (login, form, holder contact defaults); --confirmar si uploads, signs and registers in the holder name.',
      ],
    }
  if (!prepared.plan.email)
    throw new Error(
      'electronic notification needs --correo or a prefilled email; nothing was uploaded',
    )
  const receipt = await submitRelecFiling(
    client,
    { ...prepared, pairs: buildRelecTramitePairs(prepared) },
    context.identity,
  )
  const saved = await trySaveRelecOutput(client, prepared.origin, receipt, {
    plan: prepared.plan,
    outDir: context.outDir,
  })
  return { ...base, executed: true, receipt: saved.receipt, notes: saved.notes }
}
