import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { buildCadesSignedData } from '../cms/buildCadesSignedData'
import { timestampSignedData } from '../tsp/timestampSignedData'
import type { DigestName } from '../types/DigestName'
import { implicitLimitBytes } from './implicitLimitBytes'
import { cmsPolicyOf } from './mappers/cmsPolicyOf'
import { timestampAuthorityOf } from './mappers/timestampAuthorityOf'
import { selectAgePolicyRequested } from './selectors/selectAgePolicyRequested'
import type { AutoScriptSigning } from './types/AutoScriptSigning'

/**
 * An AutoScript CAdES signature: explicit (detached) unless `mode=implicit`,
 * as in AutoFirma; under the AGE policy and without a `mode`, implicit below
 * 1 MB (`ExtraParamsProcessor`, clienteafirma 0d7f3cf). CAdES-T when
 * `tsaURL` names a TSA.
 */
export const signAutoScriptCades = async (
  identity: CertificateIdentity,
  signing: AutoScriptSigning,
  digest: DigestName,
): Promise<Buffer> => {
  const { data, params } = signing
  const requested = params.get('mode')
  if (
    requested !== undefined &&
    requested !== 'implicit' &&
    requested !== 'explicit'
  )
    throw new Error(`unsupported CAdES mode: ${requested}`)
  const implicitByPolicy =
    selectAgePolicyRequested(params) && data.length < implicitLimitBytes
  const cms = buildCadesSignedData(identity, data, {
    mode: requested ?? (implicitByPolicy ? 'implicit' : 'explicit'),
    digest,
    policy: cmsPolicyOf(params),
  })
  const authority = timestampAuthorityOf(params)
  return authority === undefined
    ? cms
    : timestampSignedData(cms, authority, signing.post)
}
