import type { HttpClient } from '../../http/types/HttpClient'
import { writeReportPdf } from '../../tgss/debt/writeReportPdf'
import { fetchEmceCertificate } from '../census/fetchers/fetchEmceCertificate'
import { openAeatSession } from '../session/openAeatSession'
import { compliancePurposes } from './compliancePurposes'
import { complianceValidationFields } from './mappers/complianceValidationFields'
import { holderSigner } from './mappers/holderSigner'
import { madridIsoDate } from './mappers/madridIsoDate'
import { parseComplianceSign } from './parsers/parseComplianceSign'
import { readPdfText } from './parsers/readPdfText'
import type { ComplianceCertificateRequest } from './types/ComplianceCertificateRequest'
import type { ComplianceCertificateResult } from './types/ComplianceCertificateResult'

/**
 * Emit the holder's "certificado de estar al corriente de obligaciones
 * tributarias" (procedure G304) at ECOTInternetCiudadanosServlet, the same
 * EMCE-JDIT flow as the census certificate, and read its sign from the PDF.
 * A NEGATIVO certificate is still a certificate: it is returned, not thrown.
 */
export const emitComplianceCertificate = async (
  client: HttpClient,
  request: ComplianceCertificateRequest,
  outDir: string | undefined,
): Promise<ComplianceCertificateResult> => {
  const info = compliancePurposes[request.purpose]
  const notes = [
    'FIR=FirmaBasica is a form value the portal names "firma basica": certificate authentication, not a cryptographic signature',
    'the certificate can be NEGATIVO; positive is read from the PDF text',
  ]
  await openAeatSession(client)
  const { csv, pdf, signedBy } = await fetchEmceCertificate(
    client,
    'ECOTInternetCiudadanosServlet',
    (islw) => complianceValidationFields(islw, info.value),
    holderSigner(request.nif),
  )
  const fileName = `aeat-corriente-${request.purpose}-${request.nif}-${madridIsoDate(new Date())}.pdf`
  const pdfPath =
    outDir === undefined
      ? undefined
      : await writeReportPdf(outDir, fileName, pdf)
  return {
    ...request,
    nombre: signedBy.nombre,
    label: info.label,
    csv,
    positive: parseComplianceSign(readPdfText(pdf)),
    pdfPath,
    bytes: pdf.length,
    notes,
  }
}
