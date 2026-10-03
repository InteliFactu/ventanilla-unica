import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { roleceUrls } from '../session/roleceUrls'

/**
 * The first screen of "Solicitud > Persona Jurídica": open the form (it
 * redirects to `inscripcionPersonaF!comprobarPJ.action`, which marks the
 * session as a legal-entity application) and post the identifier with
 * `method:comprobarOEInscrito`. That check registers nothing; it answers
 * whether the operator is already inscribed, in the hidden `solicitudInicial`
 * and `inscrito` fields of the next screen.
 */
export const fetchRegistrationCheck = async (
  client: HttpClient,
  nif: string,
): Promise<HttpResponse> => {
  const form = await client.request(roleceUrls.legalEntityForm, {
    referer: roleceUrls.home,
  })
  return client.request(roleceUrls.applicationForm, {
    method: 'POST',
    referer: form.url,
    form: {
      tieneDatos: '',
      solicitudInicial: '',
      tipoDocumento: 'NIF',
      numDocumento: nif,
      esPJ: 'true',
      inscrito: 'false',
      'method:comprobarOEInscrito': 'Siguiente',
    },
  })
}
