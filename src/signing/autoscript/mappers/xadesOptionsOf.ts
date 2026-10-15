import type { DigestName } from '../../types/DigestName'
import type { SignXmlOptions } from '../../xades/types/SignXmlOptions'
import { parseDigestName } from '../parsers/parseDigestName'
import { selectAgePolicyRequested } from '../selectors/selectAgePolicyRequested'
import { selectXadesMode } from '../selectors/selectXadesMode'
import type { ExtraParams } from '../types/ExtraParams'
import { xadesKeyInfoOf } from './xadesKeyInfoOf'
import { xadesPolicyOf } from './xadesPolicyOf'

/**
 * The `signXml` options an AutoScript XAdES call amounts to, with AutoFirma's
 * defaults: SHA-512 references unless `referencesDigestMethod` says otherwise,
 * the key value in KeyInfo, and the roles of `signerClaimedRoles` (`|`
 * separated).
 */
export const xadesOptionsOf = (
  format: string,
  params: ExtraParams,
  signatureDigest: DigestName,
): SignXmlOptions => {
  const roles = params.get('signerClaimedRoles')
  return {
    mode: selectXadesMode(format, params, selectAgePolicyRequested(params)),
    signatureDigest,
    referencesDigest: parseDigestName(
      params.get('referencesDigestMethod') ?? 'sha512',
    ),
    keyInfo: xadesKeyInfoOf(params),
    policy: xadesPolicyOf(params),
    signerRoles: roles === undefined ? [] : roles.split('|'),
    signedNodeId: params.get('nodeToSign'),
    mimeType: params.get('mimeType'),
    detachedUri: params.get('uri'),
  }
}
