import { agePolicy } from '../../xades/agePolicy'
import { digestUris } from '../../xades/digestUris'
import type { SignaturePolicy } from '../../xades/types/SignaturePolicy'
import { parseDigestName } from '../parsers/parseDigestName'
import { selectAgePolicyRequested } from '../selectors/selectAgePolicyRequested'
import type { ExtraParams } from '../types/ExtraParams'

/**
 * The XAdES-EPES policy the parameters ask for: the AGE one on `expPolicy`, or
 * the explicit `policyIdentifier` with its hash (a bare OID becomes
 * `urn:oid:`, as AutoFirma writes it); undefined for XAdES-BES.
 */
export const xadesPolicyOf = (
  params: ExtraParams,
): SignaturePolicy | undefined => {
  if (selectAgePolicyRequested(params)) return agePolicy
  const identifier = params.get('policyIdentifier')
  if (identifier === undefined) return undefined
  const digestValue = params.get('policyIdentifierHash')
  if (digestValue === undefined)
    throw new Error('policyIdentifier needs policyIdentifierHash')
  return {
    identifier: /^\d+(?:\.\d+)+$/.test(identifier)
      ? `urn:oid:${identifier}`
      : identifier,
    description: params.get('policyDescription'),
    digestAlgorithm:
      digestUris[
        parseDigestName(params.get('policyIdentifierHashAlgorithm') ?? 'sha1')
      ],
    digestValue,
    qualifier: params.get('policyQualifier'),
  }
}
