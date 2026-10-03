import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { encodeLatin1 } from '../../http/encodeLatin1'
import { signXml } from '../../signing/xades/signXml'
import type { SignedApplication } from '../types/SignedApplication'
import { encodeSignedApplication } from './encodeSignedApplication'

/**
 * Sign the application document as the screen's AutoFirma call does
 * (`format=XAdES Enveloped`, `nodeToSign=root`, SHA256withRSA): the bytes are
 * the ISO-8859-1 of `campoXML`, which is what `encode64` of the field value
 * produces; the signature goes inside the root with `URI="#root"`, KeyInfo
 * carries the certificate and its RSA key value and is itself signed.
 */
export const signApplicationDocument = (
  identity: CertificateIdentity,
  document: string,
): SignedApplication => {
  const result = signXml(identity, encodeLatin1(document), {
    mode: 'enveloped',
    signedNodeId: 'root',
    keyInfo: { keyValue: true },
  })
  return { xml: encodeSignedApplication(result.xml), signer: result.signer }
}
