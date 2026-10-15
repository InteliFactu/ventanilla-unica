import { parseForms } from '../../../html/parsers/parseForms'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import type { RayuelaCredentials } from '../types/RayuelaCredentials'
import { fetchRayuelaResponse } from './fetchRayuelaResponse'
/** NORMAL=Entrar is required: otherwise Rayuela serves its WAI interface. */
export const fetchRayuelaLogin = async (
  client: HttpClient,
  landing: HttpResponse,
  credentials: RayuelaCredentials,
): Promise<void> => {
  const form = parseForms(landing.text, landing.url).find((item) =>
    item.action.includes('controlador.rayuela'),
  )
  if (!form) throw new Error('Rayuela login form was not found')
  const login = await fetchRayuelaResponse(client, form.action, {
    form: {
      ...form.fields,
      ...credentials,
      tipo_acceso: 'NORMAL',
      'nombre-pagina': 'identificacion',
      'nombre-pagina-destino': 'comprobar-usuario',
      NORMAL: 'Entrar',
      nav_web_nombre: 'Chrome',
      nav_web_version: '140',
    },
  })
  if (
    !login.text.includes('preparar-acceso-aplicacion') ||
    !login.text.includes('SEGUIMIENTO_EDUCATIVO')
  )
    throw new Error('Rayuela login failed')
}
