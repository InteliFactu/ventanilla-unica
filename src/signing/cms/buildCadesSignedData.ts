import { createHash } from 'node:crypto'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { derContext } from '../asn1/derContext'
import { derInteger } from '../asn1/derInteger'
import { derOctetString } from '../asn1/derOctetString'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import { derSetOf } from '../asn1/derSetOf'
import { buildSignerInfo } from './builders/buildSignerInfo'
import { cadesSignedAttributes } from './cadesSignedAttributes'
import { cmsDigestOids } from './cmsDigestOids'
import { cmsOids } from './cmsOids'
import { selectSignerCertificates } from './selectors/selectSignerCertificates'
import type { CadesSignedDataOptions } from './types/CadesSignedDataOptions'

/**
 * CAdES-B-B SignedData (RFC 5652) over `content`, with signingTime as the
 * standard requires: implicit (the content carried inside, what @firma's
 * `AutoScript.sign(data, ..., "CAdES")` returns with `mode=implicit`) or
 * explicit (detached). Returns the ContentInfo DER.
 */
export const buildCadesSignedData = (
  identity: CertificateIdentity,
  content: Buffer,
  options: CadesSignedDataOptions = {},
): Buffer => {
  const digest = options.digest ?? 'sha256'
  const certificates = selectSignerCertificates(identity)
  const contentDigest = createHash(digest).update(content).digest()
  const signedData = derSequence([
    derInteger(1),
    derSetOf([derSequence([derOid(cmsDigestOids[digest])])]),
    derSequence([
      derOid(cmsOids.data),
      ...(options.mode === 'explicit'
        ? []
        : [derContext(0, derOctetString(content))]),
    ]),
    derSetOf([certificates.signer, ...certificates.chain], 0xa0),
    derSetOf([
      buildSignerInfo(identity, digest, (signer) =>
        cadesSignedAttributes(contentDigest, signer, {
          signingTime: options.signingTime ?? new Date(),
          digest,
          policy: options.policy,
        }),
      ),
    ]),
  ])
  return derSequence([derOid(cmsOids.signedData), derContext(0, signedData)])
}
