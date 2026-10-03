import type { HtmlForm } from '../../html/types/HtmlForm'
import type { RegistrationQuery } from '../types/RegistrationQuery'

/**
 * The body "Firmar y Enviar Solicitud" would post: the screen's own hidden and
 * read-only fields as served (identifier, comunidad, the placeholder
 * denomination the registry later replaces with the Registro Mercantil's),
 * the province, both notification addresses twice, and the button. The help
 * checkbox is unchecked in a browser, so it is not posted.
 */
export const mapSimplifiedApplicationFields = (
  form: HtmlForm,
  query: RegistrationQuery,
  provincia: string,
): Readonly<Record<string, string>> => {
  const { ayudaCheck: _help, ...served } = form.fields
  return {
    ...served,
    provinciaSimpli: provincia,
    correoElectronicoSimpli: query.email,
    correoElectronicoSimpliConfirmar: query.email,
    correoElectronicoSimpliSol: query.emailSolicitante,
    correoElectronicoSimpliSolConfirmar: query.emailSolicitante,
    'method:enviarSolicitud': 'Firmar y Enviar Solicitud',
  }
}
