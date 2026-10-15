import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { signData } from '../../signData'
import { canonicalizeSubtree } from '../../xml/mappers/canonicalizeSubtree'
import type { XmlDocument } from '../../xml/types/XmlDocument'
import { selectPathById } from '../selectors/selectPathById'
import type { SignatureContext } from '../types/SignatureContext'
import { assertSignatureVerifies } from '../validators/assertSignatureVerifies'

/**
 * The base64 SignatureValue: the inclusive C14N of the final SignedInfo,
 * signed with the holder's key and checked against the certificate it names.
 */
export const computeSignatureValue = (
  identity: CertificateIdentity,
  document: XmlDocument,
  context: SignatureContext,
): string => {
  const signedInfo = Buffer.from(
    canonicalizeSubtree(selectPathById(document.root, context.ids.signedInfo), {
      withComments: false,
      exclusive: false,
    }),
  )
  const signature = signData(identity, signedInfo, context.signatureDigest)
  assertSignatureVerifies(
    context.certificates.signer,
    signedInfo,
    signature,
    context.signatureDigest,
  )
  return signature.toString('base64')
}
