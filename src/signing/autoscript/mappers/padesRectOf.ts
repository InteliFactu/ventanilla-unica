import { parsePdfRect } from '../../pades/parsers/parsePdfRect'
import type { ExtraParams } from '../types/ExtraParams'

/** The visible signature rectangle AutoFirma's `signaturePositionOnPage*` parameters give, when all four are set. */
export const padesRectOf = (params: ExtraParams): number[] | undefined => {
  const corners = [
    'LowerLeftX',
    'LowerLeftY',
    'UpperRightX',
    'UpperRightY',
  ].map((corner) => params.get(`signaturePositionOnPage${corner}`))
  if (corners.some((value) => value === undefined)) return undefined
  return parsePdfRect(corners.join(','))
}
