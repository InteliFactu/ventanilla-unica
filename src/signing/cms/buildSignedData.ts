import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { derContext } from '../asn1/derContext'
import { derInteger } from '../asn1/derInteger'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import { derSetOf } from '../asn1/derSetOf'
import { readCertificateParts } from '../asn1/parsers/readCertificateParts'
import { signData } from '../signData'
import { cmsOids } from './cmsOids'
import { selectSignerCertificates } from './selectors/selectSignerCertificates'
import { signedAttributes } from './signedAttributes'
import { signerInfo } from './signerInfo'

/**
 * Detached CMS SignedData (RFC 5652) over content whose SHA-256 is
 * `contentDigest`, signed with the holder's key: the `ETSI.CAdES.detached`
 * value a PAdES /Contents carries. Returns the ContentInfo DER.
 */
export const buildSignedData = (
  identity: CertificateIdentity,
  contentDigest: Buffer,
): Buffer => {
  const certificates = selectSignerCertificates(identity)
  const signer = readCertificateParts(certificates.signer)
  const attributes = signedAttributes(contentDigest, signer, 'sha256')
  const signature = signData(identity, derSetOf(attributes), 'sha256')
  const signedData = derSequence([
    derInteger(1),
    derSetOf([derSequence([derOid(cmsOids.sha256)])]),
    derSequence([derOid(cmsOids.data)]),
    derSetOf([certificates.signer, ...certificates.chain], 0xa0),
    derSetOf([
      signerInfo({
        signer,
        digest: 'sha256',
        attributes,
        signature,
      }),
    ]),
  ])
  return derSequence([derOid(cmsOids.signedData), derContext(0, signedData)])
}
