import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { openStaSession } from '../session/openStaSession'
import { staOrigins } from '../session/staOrigins'
import { fetchRelecHolderContact } from './fetchers/fetchRelecHolderContact'
import { openRelecForm } from './fetchers/openRelecForm'
import { mapRelecForm } from './mappers/mapRelecForm'
import { mapRelecInstancePlan } from './mappers/mapRelecInstancePlan'
import { mapRelecTramiteTarget } from './mappers/mapRelecTramiteTarget'
import { mapRelecTramiteVariables } from './mappers/mapRelecTramiteVariables'
import { readRelecTramitaFields } from './parsers/readRelecTramitaFields'
import { readRelecTramitaFormControls } from './parsers/readRelecTramitaFormControls'
import { readRelecTramiteTextFields } from './parsers/readRelecTramiteTextFields'
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
  const controls = readRelecTramitaFormControls(page.text, page.url)
  const parsed = mapRelecForm(page.text, readRelecTramitaFields(controls))
  const writable = readRelecTramiteTextFields(controls)
  assertRelecTramiteForm(parsed, query.dboid)
  if (!writable.has('ANNOT_TEXT_EXTRACT'))
    throw new Error('The procedure does not offer a writable Asunto field')
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
    variables: query.variables
      ? mapRelecTramiteVariables(form.fields, query.variables, writable)
      : [],
  }
  assertRelecTramitePlan(plan)
  const person = form.fields['DBOIDPERS'] ?? ''
  const targets = plan.documents.map((document) =>
    mapRelecTramiteTarget(origin, page.text, person, document),
  )
  for (const target of targets) assertRelecUploadSize(target)
  return { origin, formUrl: page.url, form, plan, targets }
}
