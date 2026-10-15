import type { TimestampAuthority } from '../../tsp/types/TimestampAuthority'
import { parseDigestName } from '../parsers/parseDigestName'
import type { ExtraParams } from '../types/ExtraParams'

/** The TSA AutoFirma's `tsaURL`, `tsaPolicy` and `tsaHashAlgorithm` name, or undefined without `tsaURL`. */
export const timestampServiceOf = (
  params: ExtraParams,
): TimestampAuthority | undefined => {
  const url = params.get('tsaURL')
  if (url === undefined || url === '') return undefined
  const hash = params.get('tsaHashAlgorithm')
  return {
    url,
    policy: params.get('tsaPolicy')?.replace(/^urn:oid:/i, ''),
    digest: hash === undefined ? undefined : parseDigestName(hash),
  }
}
