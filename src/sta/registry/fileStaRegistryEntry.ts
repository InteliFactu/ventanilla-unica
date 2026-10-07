import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import type { StaPortal } from '../types/StaPortal'
import { buildRegistryContent } from './builders/buildRegistryContent'
import { readRegistryContext } from './fetchers/readRegistryContext'
import { formatPersonNif } from './formatters/formatPersonNif'
import { mapRegistryPlan } from './mappers/mapRegistryPlan'
import { saveRegistryReceipt } from './saveRegistryReceipt'
import { selectDestinationKey } from './selectors/selectDestinationKey'
import { selectDocumentSlot } from './selectors/selectDocumentSlot'
import { selectNotificationEmail } from './selectors/selectNotificationEmail'
import { submitRegistryEntry } from './submitRegistryEntry'
import type { StaRegistryFilingContext } from './types/StaRegistryFilingContext'
import type { StaRegistryQuery } from './types/StaRegistryQuery'
import type { StaRegistryReceipt } from './types/StaRegistryReceipt'
import { assertPdfFiles } from './validators/assertPdfFiles'

/**
 * File an entry in an STA sede's general electronic registry in the holder's
 * own name. Without confirmation only reads run (session, draft reference,
 * holder, procedure schema) and the plan names the unit, the notice e-mail and
 * the files. With confirmation the draft is saved, the PDFs uploaded, the
 * registry form signed with the holder's key, the request submitted and, with
 * `--out`, the justificante saved.
 */
export const fileStaRegistryEntry = async (
  client: HttpClient,
  portal: StaPortal,
  query: StaRegistryQuery,
  context: StaRegistryFilingContext,
): Promise<WriteResult<StaRegistryReceipt>> => {
  const files = await assertPdfFiles(query.documents)
  const { origin, session, person, schema } = await readRegistryContext(
    client,
    portal,
  )
  const unit = selectDestinationKey(schema, query.destination)
  const notificationEmail = selectNotificationEmail(person)
  const action = `${portal} presentar`
  const facts = { unitLabel: unit.label, notificationEmail, files }
  const plan = mapRegistryPlan(new URL(origin).hostname, person, query, facts)
  if (!context.confirmed)
    return {
      action,
      executed: false,
      plan,
      notes: ['Only reads ran; --confirmar si files the entry.'],
    }
  const filed = await submitRegistryEntry(
    client,
    { session, slot: selectDocumentSlot(schema), identity: context.identity },
    buildRegistryContent(person, schema, {
      unitKey: unit.key,
      phone: query.phone,
      subject: query.subject,
      notificationEmail,
    }),
    query.documents,
  )
  const receipt =
    context.outDir === undefined
      ? filed
      : await saveRegistryReceipt(client, origin, filed, {
          nif: formatPersonNif(person),
          outDir: context.outDir,
        })
  return { action, executed: true, plan, receipt, notes: [] }
}
