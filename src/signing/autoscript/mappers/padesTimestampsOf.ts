import type { PdfTimestamps } from '../../pades/types/PdfTimestamps'
import type { ExtraParams } from '../types/ExtraParams'
import { timestampServiceOf } from './timestampServiceOf'

/** The PAdES timestamps AutoFirma's `tsType` asks for: 1 (default) the signature, 2 the document, 3 both. */
export const padesTimestampsOf = (params: ExtraParams): PdfTimestamps => {
  const authority = timestampServiceOf(params)
  const type = params.get('tsType') ?? '1'
  if (authority === undefined) return {}
  if (!['1', '2', '3'].includes(type))
    throw new Error(`tsType is 1, 2 or 3, not ${type}`)
  return {
    timestamp: type === '2' ? undefined : authority,
    documentTimestamp: type === '1' ? undefined : authority,
  }
}
