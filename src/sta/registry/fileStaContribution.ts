import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import type { StaPortal } from '../types/StaPortal'
import { formatPersonNif } from './formatters/formatPersonNif'
import { prepareStaContribution } from './prepareStaContribution'
import { submitRegistryEntry } from './submitRegistryEntry'
import { trySaveRegistryReceipt } from './trySaveRegistryReceipt'
import type { StaContributionQuery } from './types/StaContributionQuery'
import type { StaRegistryFilingContext } from './types/StaRegistryFilingContext'
import type { StaRegistryReceipt } from './types/StaRegistryReceipt'

/**
 * Contribute documents to an open expediente ("Aporte documentación"): the
 * holder files in their own name, or with a representative certificate for
 * the entity it represents. Without confirmation only reads run and the plan
 * names the file, the parties and the documents. With confirmation the draft
 * is saved, the PDFs uploaded, the registry form signed, the request
 * submitted and, with `--out`, the justificante saved.
 */
export const fileStaContribution = async (
  client: HttpClient,
  portal: StaPortal,
  query: StaContributionQuery,
  context: StaRegistryFilingContext,
): Promise<WriteResult<StaRegistryReceipt>> => {
  const prepared = await prepareStaContribution(client, portal, query)
  const { origin, session, person, slot, content, plan } = prepared
  const action = `${portal} aportar`
  if (!context.confirmed)
    return {
      action,
      executed: false,
      plan,
      notes: ['Only reads ran; --confirmar si registers the contribution.'],
    }
  const filed = await submitRegistryEntry(
    client,
    { session, slot, identity: context.identity },
    content,
    query.documents,
  )
  const saved = await trySaveRegistryReceipt(client, origin, filed, {
    nif: formatPersonNif(person),
    outDir: context.outDir,
  })
  return { action, executed: true, plan, ...saved }
}
