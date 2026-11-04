import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { signRelecFormXml } from './fetchers/signRelecFormXml'
import { submitTramitaJustif } from './fetchers/submitTramitaJustif'
import { submitTramitaSign } from './fetchers/submitTramitaSign'
import { parseRelecResult } from './parsers/parseRelecResult'
import { parseSignPage } from './parsers/parseSignPage'
import type { RelecReceipt } from './types/RelecReceipt'
import type { RelecSubmission } from './types/RelecSubmission'
import { uploadRelecDocuments } from './uploadRelecDocuments'

/** Shared confirmed Relec transaction: signed attachments, signed form, registration. Never retries. */
export const submitRelecFiling = async (
  client: HttpClient,
  submission: RelecSubmission,
  identity: CertificateIdentity,
): Promise<RelecReceipt> => {
  await uploadRelecDocuments(client, submission.targets, identity)
  const summary = await submitTramitaSign(
    client,
    submission.formUrl,
    submission.pairs,
  )
  const page = parseSignPage(summary.text, summary.url)
  await signRelecFormXml(client, submission.origin, page, identity)
  const result = await submitTramitaJustif(client, page, summary.url)
  return parseRelecResult(result.text, result.url)
}
