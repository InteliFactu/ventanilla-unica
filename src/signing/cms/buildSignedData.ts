import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { derContext } from '../asn1/derContext'
import { derInteger } from '../asn1/derInteger'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import { derSetOf } from '../asn1/derSetOf'
import { readCertificateParts } from '../asn1/parsers/readCertificateParts'
import { signData } from '../signData'
import { cmsDigestOids } from './cmsDigestOids'
import { cmsOids } from './cmsOids'
import { selectSignerCertificates } from './selectors/selectSignerCertificates'
import { signaturePolicyAttribute } from './signaturePolicyAttribute'
import { signedAttributes } from './signedAttributes'
import { signerInfo } from './signerInfo'
import type { DetachedSignedDataOptions } from './types/DetachedSignedDataOptions'

/**
 * Detached CMS SignedData (RFC 5652) over content whose digest is
 * `contentDigest`, signed with the holder's key: the `ETSI.CAdES.detached`
 * value a PAdES /Contents carries, with the policy attribute when EPES.
 * Returns the ContentInfo DER.
 */
export const buildSignedData = (
  identity: CertificateIdentity,
  contentDigest: Buffer,
  options: DetachedSignedDataOptions,
): Buffer => {
  const { digest, policy } = options
  const certificates = selectSignerCertificates(identity)
  const signer = readCertificateParts(certificates.signer)
  const attributes = [
    ...signedAttributes(contentDigest, signer, digest),
    ...(policy === undefined ? [] : [signaturePolicyAttribute(policy)]),
  ]
  const signature = signData(identity, derSetOf(attributes), digest)
  const signedData = derSequence([
    derInteger(1),
    derSetOf([derSequence([derOid(cmsDigestOids[digest])])]),
    derSequence([derOid(cmsOids.data)]),
    derSetOf([certificates.signer, ...certificates.chain], 0xa0),
    derSetOf([signerInfo({ signer, digest, attributes, signature })]),
  ])
  return derSequence([derOid(cmsOids.signedData), derContext(0, signedData)])
}
