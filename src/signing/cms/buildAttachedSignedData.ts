import { createHash } from 'node:crypto'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { derContext } from '../asn1/derContext'
import { derInteger } from '../asn1/derInteger'
import { derOctetString } from '../asn1/derOctetString'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import { derSetOf } from '../asn1/derSetOf'
import { readCertificateParts } from '../asn1/parsers/readCertificateParts'
import { signData } from '../signData'
import { cadesSignedAttributes } from './cadesSignedAttributes'
import { cmsDigestOids } from './cmsDigestOids'
import { cmsOids } from './cmsOids'
import { selectSignerCertificates } from './selectors/selectSignerCertificates'
import { signerInfo } from './signerInfo'
import type { AttachedSignedDataOptions } from './types/AttachedSignedDataOptions'

/**
 * Attached CMS SignedData (RFC 5652) carrying `content` itself: the implicit
 * CAdES signature @firma's `AutoScript.sign(data, ..., "CAdES")` returns by
 * default, with signingTime as CAdES-B-B requires. Returns the ContentInfo DER.
 */
export const buildAttachedSignedData = (
  identity: CertificateIdentity,
  content: Buffer,
  options: AttachedSignedDataOptions = {},
): Buffer => {
  const digest = options.digest ?? 'sha256'
  const certificates = selectSignerCertificates(identity)
  const signer = readCertificateParts(certificates.signer)
  const attributes = cadesSignedAttributes(
    createHash(digest).update(content).digest(),
    signer,
    {
      signingTime: options.signingTime ?? new Date(),
      digest,
      policy: options.policy,
    },
  )
  const signature = signData(identity, derSetOf(attributes), digest)
  const signedData = derSequence([
    derInteger(1),
    derSetOf([derSequence([derOid(cmsDigestOids[digest])])]),
    derSequence([derOid(cmsOids.data), derContext(0, derOctetString(content))]),
    derSetOf([certificates.signer, ...certificates.chain], 0xa0),
    derSetOf([signerInfo({ signer, digest, attributes, signature })]),
  ])
  return derSequence([derOid(cmsOids.signedData), derContext(0, signedData)])
}
