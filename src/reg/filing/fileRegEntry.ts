import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { fetchRegistryReport } from '../registries/fetchers/fetchRegistryReport'
import type { RegistryReport } from '../registries/types/RegistryReport'
import { mapRegFilingPlan } from './mappers/mapRegFilingPlan'
import { prepareRegFiling } from './prepareRegFiling'
import { submitRegFiling } from './submitRegFiling'
import type { RegFilingContext } from './types/RegFilingContext'
import type { RegFilingQuery } from './types/RegFilingQuery'

/**
 * File a writ with PDFs in the Registro Electrónico General, addressed to any
 * DIR3 unit, in the holder's own name. Without confirmation only reads run
 * (PDF checks, login, addressee and address lookups). With it the entry is
 * created, signed with the certificate and read back, its documents and
 * justificante saved under `--out`.
 */
export const fileRegEntry = async (
  client: HttpClient,
  query: RegFilingQuery,
  context: RegFilingContext,
): Promise<WriteResult<RegistryReport>> => {
  const prepared = await prepareRegFiling(client, query)
  const action = 'reg presentar'
  const plan = mapRegFilingPlan(query, prepared)
  if (!context.confirmed)
    return {
      action,
      executed: false,
      plan,
      notes: ['Only reads ran; --confirmar si files and signs the entry.'],
    }
  const uuid = await submitRegFiling(client, query, prepared, context.identity)
  return {
    action,
    executed: true,
    plan,
    receipt: await fetchRegistryReport(
      client,
      prepared.session.token,
      uuid,
      context.outDir,
    ),
    notes: [],
  }
}
