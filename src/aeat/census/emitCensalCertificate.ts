import type { HttpClient } from '../../http/types/HttpClient'
import { openAeatSession } from '../session/openAeatSession'
import { fetchEmceCertificate } from './fetchers/fetchEmceCertificate'
import { validationFields } from './mappers/validationFields'
import type { CensalCertificateRequest } from './types/CensalCertificateRequest'
import type { CensalCertificateResult } from './types/CensalCertificateResult'
import { writeCensalCertificatePdf } from './writeCensalCertificatePdf'

/**
 * Ask EMCE-JDIT for the holder's "certificado de situación censal": validate
 * the request (fAccion=2), confirm it with the firma básica fields, exchange
 * the CSV of the receipt for the PDF. Asked twice the same day, AEAT answers
 * the cached CSV, so a censal change filed today shows up tomorrow.
 */
export const emitCensalCertificate = async (
  client: HttpClient,
  request: CensalCertificateRequest,
  outDir: string | undefined,
): Promise<CensalCertificateResult> => {
  const notes = [
    'FIR=FirmaBasica is a form value the portal names "firma basica": certificate authentication, not a cryptographic signature',
    'asked twice on the same day, AEAT answers the cached CSV of the first certificate',
  ]
  await openAeatSession(client)
  const { csv, pdf } = await fetchEmceCertificate(
    client,
    'ServletSitCenInternet',
    validationFields,
    () => request,
  )
  const pdfPath =
    outDir === undefined
      ? undefined
      : await writeCensalCertificatePdf(outDir, `${request.nif}-${csv}`, pdf)
  return { ...request, csv, pdfPath, bytes: pdf.length, notes }
}
