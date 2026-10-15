import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { signAutoScript } from '../../signing/autoscript/signAutoScript'
import { callRegApi } from '../session/fetchers/callRegApi'
import { buildRegistryData } from './builders/buildRegistryData'
import { uploadRegPdf } from './fetchers/uploadRegPdf'
import type { CreatedRegEntry } from './types/CreatedRegEntry'
import type { PreparedRegFiling } from './types/PreparedRegFiling'
import type { RegAttachment } from './types/RegAttachment'
import type { RegFilingQuery } from './types/RegFilingQuery'
import type { SignedRegEntry } from './types/SignedRegEntry'

/**
 * The legal act, as the front's "Firmar con certificado" runs it: upload the
 * PDFs, create the entry (`registry/?certificate=true` answers `{uuid,
 * xmlSummary}`), sign the summary the way the page asks AutoFirma to
 * (`AutoScript.sign(xmlSummary, "SHA512withRSA", "XAdES Detached", null)`)
 * and post it to `registry/signCertificate/:uuid`, which answers `sign: false`
 * when the certificate is not the logged-in holder's. Returns the uuid.
 */
export const submitRegFiling = async (
  client: HttpClient,
  query: RegFilingQuery,
  prepared: PreparedRegFiling,
  identity: CertificateIdentity,
): Promise<string> => {
  const { token, holder } = prepared.session
  const attachments: RegAttachment[] = []
  for (const pdf of prepared.pdfs)
    attachments.push(await uploadRegPdf(client, token, pdf))
  const created = (await callRegApi(
    client,
    token,
    'registry/?certificate=true',
    buildRegistryData(holder, query, prepared, attachments),
  )) as CreatedRegEntry
  const { signature } = await signAutoScript(identity, {
    data: created.xmlSummary,
    algorithm: 'SHA512withRSA',
    format: 'XAdES Detached',
  })
  const signed = (await callRegApi(
    client,
    token,
    `registry/signCertificate/${encodeURIComponent(created.uuid)}`,
    JSON.stringify({ xmlSummarySigned: signature }),
  )) as SignedRegEntry
  if (!signed.sign)
    throw new Error(
      `REG: entry ${created.uuid} was created but the signature was refused (certificate not the logged-in holder's)`,
    )
  return signed.uuid
}
