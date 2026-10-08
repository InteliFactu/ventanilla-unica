import { X509Certificate } from 'node:crypto'

import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { buildAttachedSignedData } from '../../../signing/cms/buildAttachedSignedData'
import { selectSignerCertificates } from '../../../signing/cms/selectors/selectSignerCertificates'
import type { ContactEmailQuery } from '../types/ContactEmailQuery'

/**
 * The form fields after @firma's callback ran: the token is signed as
 * implicit CAdES over its Base64-decoded bytes (`AutoScript.sign` takes its
 * data in Base64), and the signature and the signer's certificate land in
 * both the `aFirmaCertData.*` and the bare `signedData` textareas.
 * `tipoOperacion` is 2 because the page script sets it on load.
 */
export const buildSignedFields = (
  identity: CertificateIdentity,
  token: string,
  query: ContactEmailQuery,
): Record<string, string> => {
  const signature = buildAttachedSignedData(
    identity,
    Buffer.from(token, 'base64'),
  ).toString('base64')
  const signer = selectSignerCertificates(identity).signer
  const certificate = new X509Certificate(signer)
  return {
    'aFirmaCertData.issuer': certificate.issuer.replaceAll('\n', ', '),
    'aFirmaCertData.subject': certificate.subject.replaceAll('\n', ', '),
    'aFirmaCertData.serialNumber': certificate.serialNumber,
    'aFirmaCertData.dateFrom': certificate.validFrom,
    'aFirmaCertData.dateTo': certificate.validTo,
    'aFirmaCertData.keyType': '',
    'aFirmaCertData.unsignedData': '',
    'aFirmaCertData.signedData': signature,
    'aFirmaCertData.base64': signer.toString('base64'),
    tipoOperacion: '2',
    unsignedData: token,
    signedData: signature,
    identificador: query.identificador,
    correoElectronico: query.email,
    confCorreoElectronico: query.email,
  }
}
