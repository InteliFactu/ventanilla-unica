import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { roleceUrls } from '../session/roleceUrls'

/**
 * The second screen of an initial legal-entity application: post the
 * comunidad autónoma of the registered office. For a Spanish sociedad
 * mercantil in a comunidad that has the simplified procedure (Extremadura
 * does) the answer is the "Solicitud de Inscripción Inicial Sociedad
 * Mercantil" form, whose only button is "Firmar y Enviar Solicitud". Like
 * the first screen, this post files nothing.
 */
export const fetchSimplifiedForm = async (
  client: HttpClient,
  nif: string,
  comunidad: string,
): Promise<HttpResponse> =>
  client.request(roleceUrls.applicationForm, {
    method: 'POST',
    referer: roleceUrls.applicationForm,
    form: {
      tieneDatos: '',
      solicitudInicial: 'true',
      tipoDocumento: 'NIF',
      numDocumento: nif,
      tipoComunidad: comunidad,
      esPJ: 'true',
      inscrito: 'false',
      'method:comprobarOEInscrito': 'Siguiente',
    },
  })
