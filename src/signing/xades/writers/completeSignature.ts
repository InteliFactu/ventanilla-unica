import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { XmlDocument } from '../../xml/types/XmlDocument'
import { computeReferenceDigest } from '../mappers/computeReferenceDigest'
import { computeSignatureValue } from '../mappers/computeSignatureValue'
import type { SignatureContext } from '../types/SignatureContext'
import type { SignatureSkeleton } from '../types/SignatureSkeleton'

/** Fill a placed signature skeleton: digest every reference on the final tree, then sign the canonical SignedInfo. */
export const completeSignature = (
  identity: CertificateIdentity,
  document: XmlDocument,
  skeleton: SignatureSkeleton,
  context: SignatureContext,
): void => {
  for (const pending of skeleton.references)
    pending.digest.value = computeReferenceDigest(
      document,
      skeleton.signature,
      pending.target,
      context.referencesDigest,
    )
  skeleton.signatureValue.value = computeSignatureValue(
    identity,
    document,
    context,
  )
}
