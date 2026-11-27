import type { HttpResponse } from '../../../http/types/HttpResponse'
import { teaExpedientesUrl } from '../teaExpedientesUrl'

/** Reject portal errors before interpreting holder or case markup. */
export const assertTeaExpedientesResponse = (
  response: Pick<HttpResponse, 'status' | 'url'>,
): void => {
  const { origin, pathname } = new URL(response.url)
  const endpoint = `${origin}${pathname}`
  if (
    endpoint ===
    'https://sede.agenciatributaria.gob.es/Sede/errores/erro4033.html'
  ) {
    throw new Error(
      'TEA: the sede could not identify the electronic certificate',
    )
  }
  if (response.status !== 200) {
    throw new Error(
      `TEA: Mis expedientes returned HTTP ${String(response.status)}`,
    )
  }
  if (endpoint !== teaExpedientesUrl) {
    throw new Error('TEA: the response did not reach Mis expedientes')
  }
}
