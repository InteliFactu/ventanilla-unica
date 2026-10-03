import type { HttpResponse } from '../../http/types/HttpResponse'
import { selectFormByName } from '../../sepe/certificates/selectors/selectFormByName'
import type { SigningScreen } from '../types/SigningScreen'
import { assertSigningRequest } from '../validators/assertSigningRequest'
import { readOnloadToken } from './readOnloadToken'

/**
 * Read the screen "Firmar y Enviar Solicitud" answers. Its Firmar button runs
 * `preparaFormulario('firmaSolicitud', '/comun/firmaSolicitud!firmarSolicitud')`
 * and AutoFirma; on success `firmaExito` fills `firma` and `xmlFirmado` and
 * calls `form.submit()`, which posts no button, so the Volver submit is left
 * out.
 */
export const readSigningScreen = (page: HttpResponse): SigningScreen => {
  const form = selectFormByName(page.text, 'firmaSolicitud', page.url)
  if (!form)
    throw new Error(
      `ROLECE: no signing form after "Firmar y Enviar Solicitud" at ${page.url} (${String(page.status)})`,
    )
  assertSigningRequest(page.text)
  const fields = Object.fromEntries(
    Object.entries(form.fields).filter(([name]) => !name.startsWith('method:')),
  )
  const document = fields['campoXML']
  if (!document) throw new Error('ROLECE: the signing form has no campoXML')
  const token = readOnloadToken(page.text) ?? fields['token'] ?? ''
  return {
    url: page.url,
    action: new URL('/rolece/comun/firmaSolicitud!firmarSolicitud', page.url)
      .href,
    fields: { ...fields, token },
    document,
  }
}
