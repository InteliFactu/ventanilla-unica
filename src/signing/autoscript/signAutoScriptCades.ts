import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { buildCadesSignedData } from '../cms/buildCadesSignedData'
import type { DigestName } from '../types/DigestName'
import { implicitLimitBytes } from './implicitLimitBytes'
import { cmsPolicyOf } from './mappers/cmsPolicyOf'
import { selectAgePolicyRequested } from './selectors/selectAgePolicyRequested'
import type { ExtraParams } from './types/ExtraParams'

/**
 * An AutoScript CAdES signature: explicit (detached) unless `mode=implicit`,
 * as in AutoFirma; under the AGE policy and without a `mode`, implicit below
 * 1 MB (`ExtraParamsProcessor`, clienteafirma 0d7f3cf).
 */
export const signAutoScriptCades = (
  identity: CertificateIdentity,
  data: Buffer,
  params: ExtraParams,
  digest: DigestName,
): Buffer => {
  const requested = params.get('mode')
  if (
    requested !== undefined &&
    requested !== 'implicit' &&
    requested !== 'explicit'
  )
    throw new Error(`unsupported CAdES mode: ${requested}`)
  const implicitByPolicy =
    selectAgePolicyRequested(params) && data.length < implicitLimitBytes
  return buildCadesSignedData(identity, data, {
    mode: requested ?? (implicitByPolicy ? 'implicit' : 'explicit'),
    digest,
    policy: cmsPolicyOf(params),
  })
}
