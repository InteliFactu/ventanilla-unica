import { createHash, randomUUID } from 'node:crypto'

import type { CertificateIdentity } from '../certificate/types/CertificateIdentity'
import { signData } from '../signing/signData'
import { buildElement } from '../signing/xades/builders/buildElement'
import { buildTextElement } from '../signing/xades/builders/buildTextElement'
import { formatSignedXml } from '../signing/xades/formatters/formatSignedXml'
import { parseCertificateChain } from '../signing/xades/parsers/parseCertificateChain'
import { xadesUris } from '../signing/xades/xadesUris'
import { buildFaceSecurityKeyInfo } from './buildFaceSecurityKeyInfo'
import { buildLegacyFaceBody } from './buildLegacyFaceBody'
import { buildLegacyFaceSignedInfo } from './buildLegacyFaceSignedInfo'
import { canonicalizeFaceSoapSubtree } from './canonicalizeFaceSoapSubtree'
import type { LegacyFaceDelivery } from './LegacyFaceDelivery'
import { legacyFaceUris } from './legacyFaceUris'

/** Sign the SOAP Body using the archived Zeep WS-Security profile. */
export const signLegacyFaceSoap = (
  identity: CertificateIdentity,
  invoice: Buffer,
  delivery: LegacyFaceDelivery,
): Buffer => {
  const { signer } = parseCertificateChain(identity.cert)
  const id = `id-${randomUUID()}`
  const body = buildLegacyFaceBody(id, invoice, delivery)
  const security = buildElement('wsse:Security', {
    'xmlns:wsse': legacyFaceUris.wsse,
  })
  const header = buildElement('soap:Header', {}, [security])
  const root = buildElement(
    'soap:Envelope',
    { 'xmlns:soap': legacyFaceUris.soap, 'xmlns:wsu': legacyFaceUris.wsu },
    [header, body],
  )
  const digest = createHash('sha1')
    .update(canonicalizeFaceSoapSubtree([root, body]))
    .digest('base64')
  const signedInfo = buildLegacyFaceSignedInfo(id, digest)
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
    buildFaceSecurityKeyInfo(signer),
  )
  return formatSignedXml({ root, prolog: [], epilog: [] })
}
