import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import type { HttpClient } from '../http/types/HttpClient'
import { selectCommonName } from '../signing/pades/selectors/selectCommonName'
import { buildComplaintAnswers } from './builders/buildComplaintAnswers'
import { buildFormValues } from './builders/buildFormValues'
import { buildRequestDocument } from './builders/buildRequestDocument'
import { checkPostalCode } from './fetchers/checkPostalCode'
import { fetchPdfTexts } from './fetchers/fetchPdfTexts'
import { fetchPlace } from './fetchers/fetchPlace'
import { fetchProcedureForm } from './fetchers/fetchProcedureForm'
import { openDgsfpSession } from './session/openDgsfpSession'
import type { DgsfpComplaintQuery } from './types/DgsfpComplaintQuery'
import type { DgsfpPreparedComplaint } from './types/DgsfpPreparedComplaint'
import { readComplaintFiles } from './validators/readComplaintFiles'

/**
 * The read-only half of a filing: read and hash the PDFs, log in, check the
 * session is the certificate's holder, read the form, resolve and validate
 * the address, fill the form and draw the request document with the sede's
 * texts and HMAC. Nothing here is saved at the sede.
 */
export const prepareComplaint = async (
  client: HttpClient,
  query: DgsfpComplaintQuery,
  identity: CertificateIdentity,
): Promise<DgsfpPreparedComplaint> => {
  const files = await readComplaintFiles(query.files)
  const session = await openDgsfpSession(client)
  if (
    !selectCommonName(identity)
      .toUpperCase()
      .includes(session.holder.identificador.toUpperCase())
  )
    throw new Error(
      `DGSFP: the session is ${session.holder.identificador}, not the certificate's holder; nothing is filed`,
    )
  const form = await fetchProcedureForm(client, session.digest)
  const place = await fetchPlace(client, session.digest, query)
  await checkPostalCode(client, session.digest, {
    provinceKey: place.province.key,
    postalCode: query.postalCode,
  })
  const byField = Object.fromEntries(files.map((file) => [file.field, file]))
  const values = buildFormValues(
    form,
    session.holder,
    buildComplaintAnswers(query, place, byField),
  )
  const datosFormulario = JSON.stringify(values)
  const texts = await fetchPdfTexts(client, session.digest, datosFormulario)
  const document = buildRequestDocument(values, texts)
  const numTelematico = form.numTelematico
  return {
    session,
    numTelematico,
    place,
    files,
    values,
    datosFormulario,
    document,
  }
}
