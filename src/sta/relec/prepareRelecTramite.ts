import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { openStaSession } from '../session/openStaSession'
import { staOrigins } from '../session/staOrigins'
import { fetchRelecHolderContact } from './fetchers/fetchRelecHolderContact'
import { openRelecForm } from './fetchers/openRelecForm'
import { mapRelecInstancePlan } from './mappers/mapRelecInstancePlan'
import { mapRelecTramiteTarget } from './mappers/mapRelecTramiteTarget'
import { parseRelecForm } from './parsers/parseRelecForm'
import type { RelecTramitePreparation } from './types/RelecTramitePreparation'
import type { RelecTramiteQuery } from './types/RelecTramiteQuery'
import { assertPdfSignable } from './validators/assertPdfSignable'
import { assertRelecFiles } from './validators/assertRelecFiles'
import { assertRelecTramiteForm } from './validators/assertRelecTramiteForm'
import { assertRelecTramitePlan } from './validators/assertRelecTramitePlan'
import { assertRelecUploadSize } from './validators/assertRelecUploadSize'

/** Check local PDFs and the live catalogue form without uploading or registering. */
export const prepareRelecTramite = async (
  client: HttpClient,
  query: RelecTramiteQuery,
  identity: CertificateIdentity,
): Promise<RelecTramitePreparation> => {
  const files = await assertRelecFiles(query.documents)
  for (const file of files) await assertPdfSignable(identity, file.path)
  const origin = staOrigins.caceres
  await openStaSession(client, origin)
  const page = await openRelecForm(client, origin, query.dboid)
  const parsed = parseRelecForm(page.text, page.url)
  assertRelecTramiteForm(parsed, query.dboid)
  const form = {
    ...parsed,
    contact: await fetchRelecHolderContact(client, origin, page.text),
  }
  const plan = {
    ...mapRelecInstancePlan(
      new URL(origin).hostname,
      { ...query, represented: undefined },
      form,
      files,
    ),
    dboid: query.dboid,
    represented: undefined,
  }
  assertRelecTramitePlan(plan)
  const person = form.fields['DBOIDPERS'] ?? ''
  const targets = plan.documents.map((document) =>
    mapRelecTramiteTarget(origin, page.text, person, document),
  )
  for (const target of targets) assertRelecUploadSize(target)
  return { origin, formUrl: page.url, form, plan, targets }
}
