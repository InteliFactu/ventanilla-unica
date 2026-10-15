import type { HttpClient } from '../../http/types/HttpClient'
import type { StaRegistryFilingContext } from '../registry/types/StaRegistryFilingContext'
import { openStaSession } from '../session/openStaSession'
import { staOrigins } from '../session/staOrigins'
import { openRelecForm } from './fetchers/openRelecForm'
import { instanceProcedure } from './instanceProcedure'
import { mapRelecInstancePlan } from './mappers/mapRelecInstancePlan'
import { mapRelecInstancePlanLines } from './mappers/mapRelecInstancePlanLines'
import { parseRelecForm } from './parsers/parseRelecForm'
import type { RelecInstanceQuery } from './types/RelecInstanceQuery'
import type { RelecInstanceResult } from './types/RelecInstanceResult'
import { assertPdfSignable } from './validators/assertPdfSignable'
import { assertRelecFiles } from './validators/assertRelecFiles'

/**
 * `caceres instancia`: plan an "Instancia general" at the Ayuntamiento de
 * Cáceres sede through its Relec form. It checks the PDFs, logs in, opens the
 * form and maps each document to its row; nothing is uploaded. With
 * confirmation it refuses before any request: this form's rows are keyed by
 * their `DocReq` dboid and carry inputs (`pid`, `CUD`) that `caceres aportar`
 * never posts, so its submission has not been captured.
 */
export const planRelecInstance = async (
  client: HttpClient,
  query: RelecInstanceQuery,
  context: StaRegistryFilingContext,
): Promise<RelecInstanceResult> => {
  if (context.confirmed)
    throw new Error(
      'caceres instancia cannot file yet: the Instancia general submission has not been captured. Nothing was sent.',
    )
  const files = await assertRelecFiles(query.documents)
  for (const file of files) await assertPdfSignable(context.identity, file.path)
  const origin = staOrigins.caceres
  await openStaSession(client, origin)
  const page = await openRelecForm(client, origin, instanceProcedure)
  const form = parseRelecForm(page.text, page.url)
  const filing = mapRelecInstancePlan(
    new URL(origin).hostname,
    query,
    form,
    files,
  )
  return {
    action: 'caceres instancia',
    executed: false,
    plan: mapRelecInstancePlanLines(filing),
    filing,
    notes: [
      'Only reads ran (login, form); filing is not built yet, so --confirmar si refuses.',
    ],
  }
}
