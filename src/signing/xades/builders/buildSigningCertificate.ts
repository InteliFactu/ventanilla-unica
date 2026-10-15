import type { XmlElement } from '../../xml/types/XmlElement'
import { digestUris } from '../digestUris'
import { formatDistinguishedName } from '../formatters/formatDistinguishedName'
import { decimalSerialNumber } from '../mappers/decimalSerialNumber'
import { digestBase64 } from '../mappers/digestBase64'
import type { SignatureContext } from '../types/SignatureContext'
import { buildDigestElements } from './buildDigestElements'
import { buildElement } from './buildElement'
import { buildText } from './buildText'
import { buildTextElement } from './buildTextElement'

/**
 * xades:SigningCertificate (v1) or xades:SigningCertificateV2: the digest of
 * the signer certificate, with the references' digest as AutoFirma does, and in v1 its IssuerSerial. V2 leaves the
 * optional IssuerSerialV2 out.
 */
export const buildSigningCertificate = (
  context: SignatureContext,
): XmlElement => {
  const { ds, xades } = context.prefixes
  const { signer } = context.certificates
  const digest = buildElement(
    `${xades}:CertDigest`,
    {},
    buildDigestElements(
      ds,
      digestUris[context.referencesDigest],
      buildText(digestBase64(context.referencesDigest, signer.raw)),
    ),
  )
  const issuerSerial = buildElement(`${xades}:IssuerSerial`, {}, [
    buildTextElement(
      `${ds}:X509IssuerName`,
      formatDistinguishedName(signer.issuer),
    ),
    buildTextElement(`${ds}:X509SerialNumber`, decimalSerialNumber(signer)),
  ])
  const version2 = context.signingCertificateVersion === 2
  return buildElement(
    `${xades}:${version2 ? 'SigningCertificateV2' : 'SigningCertificate'}`,
    {},
    [
      buildElement(
        `${xades}:Cert`,
        {},
        version2 ? [digest] : [digest, issuerSerial],
      ),
    ],
  )
}
