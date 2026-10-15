import { derNode } from '../asn1/derNode'
import { derOctetString } from '../asn1/derOctetString'
import { derOid } from '../asn1/derOid'
import { derSequence } from '../asn1/derSequence'
import { cmsAttribute } from './cmsAttribute'
import { cmsDigestOids } from './cmsDigestOids'
import { cmsOids } from './cmsOids'
import type { CmsSignaturePolicy } from './types/CmsSignaturePolicy'

/**
 * sigPolicyId (RFC 5126): SignaturePolicyId ::= SEQUENCE { sigPolicyId OID,
 * sigPolicyHash SEQUENCE { AlgorithmIdentifier, OCTET STRING },
 * sigPolicyQualifiers SEQUENCE OF { id-spq-ets-uri, IA5String } OPTIONAL }.
 */
export const signaturePolicyAttribute = (
  policy: CmsSignaturePolicy,
): Buffer => {
  const ia5String = 0x16
  const qualifiers =
    policy.uri === undefined
      ? []
      : [
          derSequence([
            derSequence([
              derOid(cmsOids.policyQualifierUri),
              derNode(ia5String, Buffer.from(policy.uri, 'ascii')),
            ]),
          ]),
        ]
  return cmsAttribute(cmsOids.signaturePolicyIdentifier, [
    derSequence([
      derOid(policy.oid),
      derSequence([
        derSequence([derOid(cmsDigestOids[policy.digest])]),
        derOctetString(Buffer.from(policy.digestValue, 'base64')),
      ]),
      ...qualifiers,
    ]),
  ])
}
