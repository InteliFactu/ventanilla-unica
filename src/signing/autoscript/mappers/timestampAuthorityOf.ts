import type { TimestampAuthority } from '../../tsp/types/TimestampAuthority'
import { parseDigestName } from '../parsers/parseDigestName'
import type { ExtraParams } from '../types/ExtraParams'

/**
 * The TSA AutoFirma's `tsaURL`, `tsaPolicy` and `tsaHashAlgorithm` name, or
 * undefined without `tsaURL`. Only signature timestamps (`tsType` 1, the
 * default) are made; document timestamps are refused.
 */
export const timestampAuthorityOf = (
  params: ExtraParams,
): TimestampAuthority | undefined => {
  const url = params.get('tsaURL')
  if (url === undefined || url === '') return undefined
  const type = params.get('tsType')
  if (type !== undefined && type !== '1')
    throw new Error(
      `only signature timestamps (tsType=1) are supported, not ${type}`,
    )
  const hash = params.get('tsaHashAlgorithm')
  return {
    url,
    policy: params.get('tsaPolicy')?.replace(/^urn:oid:/i, ''),
    digest: hash === undefined ? undefined : parseDigestName(hash),
  }
}
