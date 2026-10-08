import { createHash } from 'node:crypto'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { derContext } from '../asn1/derContext'
import { derInteger } from '../asn1/derInteger'
import { derOctetString } from '../asn1/derOctetString'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import { derSetOf } from '../asn1/derSetOf'
import { readCertificateParts } from '../asn1/parsers/readCertificateParts'
import { signPkcs1Sha256 } from '../signPkcs1Sha256'
import { cmsOids } from './cmsOids'
import { selectSignerCertificates } from './selectors/selectSignerCertificates'
import { signedAttributes } from './signedAttributes'
import { signerInfo } from './signerInfo'

/**
 * Attached CMS SignedData (RFC 5652) carrying `content` itself: the implicit
 * CAdES signature @firma's `AutoScript.sign(data, ..., "CAdES")` returns by
 * default. Returns the ContentInfo DER.
 */
export const buildAttachedSignedData = (
  identity: CertificateIdentity,
  content: Buffer,
): Buffer => {
  const certificates = selectSignerCertificates(identity)
  const signer = readCertificateParts(certificates.signer)
  const digest = createHash('sha256').update(content).digest()
  const attributes = signedAttributes(digest, signer)
  const signature = signPkcs1Sha256(identity, derSetOf(attributes))
  const signedData = derSequence([
    derInteger(1),
    derSetOf([derSequence([derOid(cmsOids.sha256)])]),
    derSequence([derOid(cmsOids.data), derContext(0, derOctetString(content))]),
    derSetOf([certificates.signer, ...certificates.chain], 0xa0),
    derSetOf([signerInfo({ signer, attributes, signature })]),
  ])
  return derSequence([derOid(cmsOids.signedData), derContext(0, signedData)])
}
