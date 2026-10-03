import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { applicationFormHtml } from './applicationFormHtml'

/** The synthetic screens of an initial legal-entity application, after the login, in request order. */
export const simplifiedApplicationPages = (
  nif: string,
  simplified = 'true',
): HttpResponse[] => [
  htmlResponse(
    `https://registrodelicitadores.gob.es/rolece/comun/inscripcionPersonaF!comprobarPJ.action`,
    '<p/>',
  ),
  htmlResponse(
    `https://registrodelicitadores.gob.es/rolece/comun/inscripcionPersonaF.action`,
    applicationFormHtml(
      { solicitudInicial: 'true', numDocumento: nif, inscrito: 'false' },
      '<select name="tipoComunidad"><option value="00">Seleccione una opción ...</option><option value="ES43">EXTREMADURA</option></select>',
    ),
  ),
  htmlResponse(
    `https://registrodelicitadores.gob.es/rolece/comun/inscripcionPersonaF.action`,
    applicationFormHtml(
      {
        solicitudInicial: 'true',
        solicitudSimplificada: simplified,
        tipoComunidad: 'ES43',
        organoSimplificada: 'false',
        tipoDocumento: 'NIF',
        numDocumento: nif,
        denominacionSocialSimpli:
          'DENOMINACION SOCIAL PENDIENTE DE EXTRACCION AUTOMATICA DEL REGISTRO MERCANTIL',
        esPJ: 'true',
        inscrito: 'false',
      },
      '<input type="checkbox" name="ayudaCheck" value="true"/><select name="provinciaSimpli"><option value="00">Seleccione</option><option value="ES432">CACERES</option></select><input type="submit" value="Firmar y Enviar Solicitud" name="method:enviarSolicitud"/>',
    ),
  ),
]
