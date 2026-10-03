import type { HtmlForm } from '../../html/types/HtmlForm'

/**
 * Refuse unless the screen is the simplified initial application for this
 * operator and comunidad. Every other screen (the ordinary application with
 * its sections and document uploads, or a modification of an inscribed
 * operator) has not been captured, and a plan built for one screen must not
 * be replayed against another.
 */
export const assertSimplifiedForm = (
  form: HtmlForm,
  nif: string,
  comunidad: string,
): void => {
  const { fields } = form
  if (fields['solicitudSimplificada'] !== 'true')
    throw new Error(
      'ROLECE: the portal offers the ordinary application, not the Solicitud Simplificada; only the simplified one is captured',
    )
  if (fields['numDocumento'] !== nif || fields['tipoComunidad'] !== comunidad)
    throw new Error(
      `ROLECE: the application screen is for ${fields['numDocumento'] ?? '?'} in ${fields['tipoComunidad'] ?? '?'}, not ${nif} in ${comunidad}`,
    )
  if (!('method:enviarSolicitud' in fields))
    throw new Error(
      'ROLECE: the application screen has no "Firmar y Enviar Solicitud" button',
    )
}
