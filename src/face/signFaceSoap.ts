import { createHash } from 'node:crypto'

import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import { signData } from '../signing/signData'
import { buildElement } from '../signing/xades/builders/buildElement'
import { buildTextElement } from '../signing/xades/builders/buildTextElement'
import { formatSignedXml } from '../signing/xades/formatters/formatSignedXml'
import { parseCertificateChain } from '../signing/xades/parsers/parseCertificateChain'
import { xadesUris } from '../signing/xades/xadesUris'
import { selectXmlAttributeValue } from '../signing/xml/selectors/selectXmlAttributeValue'
import type { XmlElement } from '../signing/xml/types/XmlElement'
import { buildFaceBinaryKeyInfo } from './buildFaceBinaryKeyInfo'
import { buildFaceBinaryToken } from './buildFaceBinaryToken'
import { buildFaceSecurityKeyInfo } from './buildFaceSecurityKeyInfo'
import { buildFaceSignedInfo } from './buildFaceSignedInfo'
import { canonicalizeFaceSoapSubtree } from './canonicalizeFaceSoapSubtree'
import type { FaceSoapProfile } from './FaceSoapProfile'
import { faceSoapUris } from './faceSoapUris'

/** Sign the SOAP body under the service's WS-Security profile. */
export const signFaceSoap = (
  identity: CertificateIdentity,
  body: XmlElement,
  profile: FaceSoapProfile,
): Buffer => {
  const { signer } = parseCertificateChain(identity.cert)
  const id = selectXmlAttributeValue(body, 'wsu:Id')
  if (id === undefined) throw new Error('FACe SOAP body needs an ID')
  const tokenId = `Cert-${id}`
  const binary = profile === 'supplier-v1'
  const security = buildElement(
    'wsse:Security',
    {
      'xmlns:wsse': faceSoapUris.wsse,
      ...(binary ? { 'soap:mustUnderstand': '1' } : {}),
    },
    binary ? [buildFaceBinaryToken(signer, tokenId)] : [],
  )
  const header = buildElement('soap:Header', {}, [security])
  const root = buildElement(
    'soap:Envelope',
    { 'xmlns:soap': faceSoapUris.soap, 'xmlns:wsu': faceSoapUris.wsu },
    [header, body],
  )
  const algorithm = binary ? 'sha256' : 'sha1'
  const digest = createHash(algorithm)
    .update(canonicalizeFaceSoapSubtree([root, body]))
    .digest('base64')
  const signedInfo = buildFaceSignedInfo(id, digest, algorithm)
  const signature = buildElement('ds:Signature', { 'xmlns:ds': xadesUris.ds }, [
    signedInfo,
  ])
  security.children.push(signature)
  const bytes = canonicalizeFaceSoapSubtree([
    root,
    header,
    security,
    signature,
    signedInfo,
  ])
  const value = signData(identity, bytes, 'sha1')
  signature.children.push(
    buildTextElement('ds:SignatureValue', value.toString('base64')),
    binary ? buildFaceBinaryKeyInfo(tokenId) : buildFaceSecurityKeyInfo(signer),
  )
  return formatSignedXml({ root, prolog: [], epilog: [] })
}
