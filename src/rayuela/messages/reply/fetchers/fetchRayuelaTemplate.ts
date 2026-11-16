import type { HttpClient } from '../../../../http/types/HttpClient'
import { fetchRayuelaResponse } from '../../../session/fetchers/fetchRayuelaResponse'
import { parseRayuelaTemplate } from '../parsers/parseRayuelaTemplate'
import type { RayuelaTemplate } from '../types/RayuelaTemplate'
/**
 * Call a component template the way the portal's `peticionPaginaPlantilla`
 * does: a form POST of `idPPL`, `paramsPPL` and `paramsComponente`. `PRESENTA`
 * only renders the template; `PROCESA` performs its action.
 */
export const fetchRayuelaTemplate = async (
  client: HttpClient,
  idPPL: string,
  operation: 'PRESENTA' | 'PROCESA',
  params: Readonly<Record<string, unknown>>,
): Promise<RayuelaTemplate> => {
  const response = await fetchRayuelaResponse(
    client,
    'https://rayuela.educarex.es/segedu/jsp/PrincipalPPL.jsp',
    {
      form: {
        idPPL,
        paramsPPL: JSON.stringify({ codOperacion: operation }),
        paramsComponente: JSON.stringify(params),
      },
      // jQuery declares the charset; without it the server reads the UTF-8 form as Latin-1 and garbles accents.
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    },
  )
  return parseRayuelaTemplate(response.body)
}
