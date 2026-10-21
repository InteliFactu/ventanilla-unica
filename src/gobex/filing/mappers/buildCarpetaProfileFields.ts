import { readCarpetaOptionLabel } from '../parsers/readCarpetaOptionLabel'
import type { CarpetaProfileRequest } from '../types/CarpetaProfileRequest'

/** Preserve the street address while completing its territorial codes and contacts. */
export const buildCarpetaProfileFields = (
  html: string,
  request: CarpetaProfileRequest,
): Readonly<Record<string, string>> => ({
  'formulario:cas54': readCarpetaOptionLabel(html, 'cas54', request.region),
  'formulario:cas54_ids': request.region,
  'formulario:cas38': readCarpetaOptionLabel(html, 'cas38', request.province),
  'formulario:cas38_ids': request.province,
  'formulario:cas37': readCarpetaOptionLabel(
    html,
    'cas37',
    request.municipality,
  ),
  'formulario:cas37_ids': request.municipality,
  'formulario:cas270': 'Persona Jurídica',
  'formulario:cas270_ids': '2',
  'formulario:cas27': 'Num',
  'formulario:cas27_ids': '1',
  'formulario:cas42': request.phone,
  'formulario:cas44': request.email,
  'formulario:cas315': request.email,
})
