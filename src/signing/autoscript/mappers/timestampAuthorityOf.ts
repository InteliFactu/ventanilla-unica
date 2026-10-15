import type { TimestampAuthority } from '../../tsp/types/TimestampAuthority'
import type { ExtraParams } from '../types/ExtraParams'
import { timestampServiceOf } from './timestampServiceOf'

/**
 * The TSA that stamps a CAdES or XAdES signature, or undefined without
 * `tsaURL`. Document timestamps (`tsType` 2 and 3) are PAdES only in
 * AutoFirma, so they are refused here.
 */
export const timestampAuthorityOf = (
  params: ExtraParams,
): TimestampAuthority | undefined => {
  const type = params.get('tsType')
  if (type !== undefined && type !== '1')
    throw new Error(
      `document timestamps (tsType=${type}) are only made on PAdES`,
    )
  return timestampServiceOf(params)
}
