import type { RayuelaSession } from '../types/RayuelaSession'
import { validateRayuelaUrl } from '../validators/validateRayuelaUrl'
/** The direct entry returns JSON preceded by blank lines. */
export const parseRayuelaEntry = (text: string): RayuelaSession => {
  const data: unknown = JSON.parse(text.trim())
  if (
    typeof data !== 'object' ||
    data === null ||
    !('nombreVentana' in data) ||
    typeof data.nombreVentana !== 'string' ||
    !('menu' in data) ||
    typeof data.menu !== 'string' ||
    !('barraNavegacion' in data) ||
    typeof data.barraNavegacion !== 'string'
  )
    throw new Error('Rayuela returned an invalid session')
  return {
    window: data.nombreVentana,
    menu: validateRayuelaUrl(data.menu),
    navigation: validateRayuelaUrl(data.barraNavegacion),
  }
}
