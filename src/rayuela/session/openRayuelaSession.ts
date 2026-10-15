import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaLogin } from './fetchers/fetchRayuelaLogin'
import { fetchRayuelaResponse } from './fetchers/fetchRayuelaResponse'
import { parseRayuelaEntry } from './parsers/parseRayuelaEntry'
import { parseRayuelaModuleUrl } from './parsers/parseRayuelaModuleUrl'
import { readRayuelaCredentials } from './readRayuelaCredentials'
import type { RayuelaSession } from './types/RayuelaSession'
/** Open educational monitoring using the normal desktop password flow. */
export const openRayuelaSession = async (
  client: HttpClient,
): Promise<RayuelaSession> => {
  const credentials = readRayuelaCredentials()
  const landing = await fetchRayuelaResponse(
    client,
    'https://rayuela.educarex.es/',
  )
  await fetchRayuelaLogin(client, landing, credentials)
  const module = await fetchRayuelaResponse(
    client,
    'https://rayuela.educarex.es/modulo_acceso/controlador.rayuela',
    {
      form: {
        'nombre-pagina': 'seleccion-modulo',
        'nombre-pagina-destino': 'preparar-acceso-aplicacion',
        aplicacionSeleccionada: 'SEGUIMIENTO_EDUCATIVO',
      },
    },
  )
  const entry = await fetchRayuelaResponse(
    client,
    parseRayuelaModuleUrl(module.text),
  )
  return parseRayuelaEntry(entry.text)
}
