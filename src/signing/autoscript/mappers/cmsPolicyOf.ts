import { agePolicyCms } from '../../cms/agePolicyCms'
import type { CmsSignaturePolicy } from '../../cms/types/CmsSignaturePolicy'
import { parseDigestName } from '../parsers/parseDigestName'
import { selectAgePolicyRequested } from '../selectors/selectAgePolicyRequested'
import type { ExtraParams } from '../types/ExtraParams'

/**
 * The CAdES/PAdES-EPES policy the parameters ask for: the AGE one on
 * `expPolicy`, or the explicit `policyIdentifier` (an OID, `urn:oid:` or not)
 * with its hash; undefined for BES.
 */
export const cmsPolicyOf = (
  params: ExtraParams,
): CmsSignaturePolicy | undefined => {
  if (selectAgePolicyRequested(params)) return agePolicyCms
  const identifier = params.get('policyIdentifier')
  if (identifier === undefined) return undefined
  const oid = identifier.replace(/^urn:oid:/i, '')
  if (!/^\d+(?:\.\d+)+$/.test(oid))
    throw new Error(`a CAdES policy identifier must be an OID: ${identifier}`)
  const digestValue = params.get('policyIdentifierHash')
  if (digestValue === undefined)
    throw new Error('policyIdentifier needs policyIdentifierHash')
  return {
    oid,
    digest: parseDigestName(
      params.get('policyIdentifierHashAlgorithm') ?? 'sha1',
    ),
    digestValue,
    uri: params.get('policyQualifier'),
  }
}
