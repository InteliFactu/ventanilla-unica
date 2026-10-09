import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { buildTramitaSignPairs } from './builders/buildTramitaSignPairs'
import { signRelecFormXml } from './fetchers/signRelecFormXml'
import { submitTramitaJustif } from './fetchers/submitTramitaJustif'
import { submitTramitaSign } from './fetchers/submitTramitaSign'
import { parseRelecResult } from './parsers/parseRelecResult'
import { parseSignPage } from './parsers/parseSignPage'
import { selectRepresented } from './selectors/selectRepresented'
import type { RelecPreparation } from './types/RelecPreparation'
import type { RelecReceipt } from './types/RelecReceipt'
import { uploadRelecDocuments } from './uploadRelecDocuments'

/**
 * The confirmed half: attach and sign the PDFs, post the form ("Continuar"),
 * sign the registry form XML, register (`TramitaJustif`) and read the CSV
 * of the justificante from the answer. Only the last request is the act.
 */
export const submitRelecContribution = async (
  client: HttpClient,
  prepared: RelecPreparation,
  identity: CertificateIdentity,
): Promise<RelecReceipt> => {
  const { origin, form, formUrl, plan, types } = prepared
  await uploadRelecDocuments(client, prepared, identity)
  const pairs = buildTramitaSignPairs(
    form,
    selectRepresented(form),
    plan,
    types[0]?.dboid ?? '',
  )
  const summary = await submitTramitaSign(client, formUrl, pairs)
  const page = parseSignPage(summary.text, summary.url)
  await signRelecFormXml(client, origin, page, identity)
  const result = await submitTramitaJustif(client, page, summary.url)
  return parseRelecResult(result.text, result.url)
}
