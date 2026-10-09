import type { HttpClient } from '../../http/types/HttpClient'
import type { StaRegistryFilingContext } from '../registry/types/StaRegistryFilingContext'
import { mapRelecPlanLines } from './mappers/mapRelecPlanLines'
import { prepareRelecContribution } from './prepareRelecContribution'
import { submitRelecContribution } from './submitRelecContribution'
import { trySaveRelecOutput } from './trySaveRelecOutput'
import type { RelecQuery } from './types/RelecQuery'
import type { RelecResult } from './types/RelecResult'

/**
 * `caceres aportar`: contribute documents to an expediente or registry entry
 * at the Ayuntamiento de Cáceres sede through its Relec form ("Aportación de
 * documentación"), as representative of the entity the certificate
 * represents. Without confirmation only the login, the form and the type
 * list are read and the plan is returned; with it the PDFs are uploaded and
 * signed, the form signed and registered and, with `--out`, the justificante
 * and a JSON receipt saved.
 */
export const fileRelecContribution = async (
  client: HttpClient,
  query: RelecQuery,
  context: StaRegistryFilingContext,
): Promise<RelecResult> => {
  const prepared = await prepareRelecContribution(
    client,
    query,
    context.identity,
  )
  const { plan } = prepared
  const base = {
    action: 'caceres aportar',
    plan: mapRelecPlanLines(plan),
    filing: plan,
  }
  if (!context.confirmed)
    return {
      ...base,
      executed: false,
      notes: [
        'Only reads ran (login, form, document types); --confirmar si uploads, signs and registers.',
      ],
    }
  const filed = await submitRelecContribution(
    client,
    prepared,
    context.identity,
  )
  const saved = await trySaveRelecOutput(client, prepared.origin, filed, {
    plan,
    outDir: context.outDir,
  })
  const missing =
    saved.receipt.registryNumber === undefined
      ? [
          'The result page names no registry number; it is on the justificante and in `caceres registros`.',
        ]
      : []
  return {
    ...base,
    executed: true,
    receipt: saved.receipt,
    notes: [...saved.notes, ...missing],
  }
}
