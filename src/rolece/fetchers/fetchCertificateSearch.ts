import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { roleceUrls } from '../session/roleceUrls'

/**
 * "Certificado ROLECE > Emisión" (`?tipo=1`, certificado ordinario): open the
 * screen, then search by identifier with `method:buscar`. Searching needs no
 * captcha; viewing or downloading a row does.
 */
export const fetchCertificateSearch = async (
  client: HttpClient,
  nif: string,
): Promise<HttpResponse> => {
  const screen = await client.request(`${roleceUrls.certificateSearch}?tipo=1`)
  return client.request(roleceUrls.certificateSearch, {
    method: 'POST',
    referer: screen.url,
    form: {
      codigoOperador: '',
      idiomaNavegador: '',
      codIdentificacionSeleccionado: '',
      codIdentificacion: nif,
      denominacionSocial: '',
      tipoDocSeleccionado: 'XML',
      'method:buscar': 'Buscar',
    },
  })
}
