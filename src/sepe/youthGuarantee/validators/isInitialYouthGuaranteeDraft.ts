import { readAttribute } from '../../../html/readAttribute'

export const isInitialYouthGuaranteeDraft = (html: string): boolean => {
  const clean = html.replaceAll(/<!--[\s\S]*?-->/g, '')
  const inputs = [...clean.matchAll(/<input\b[^>]*>/gi)].map(([tag]) => tag)
  const initial = inputs.some(
    (tag) =>
      readAttribute(tag, 'name') ===
        'situacionSolicitante.estadoInscripcion.idEstadoInscripcionC' &&
      readAttribute(tag, 'value') === '01',
  )
  const unconsolidated = inputs.some(
    (tag) =>
      readAttribute(tag, 'name') === 'tieneSolicitudConsolidada' &&
      readAttribute(tag, 'value') === '',
  )
  return initial && unconsolidated && /DECLARACIÓN RESPONSABLE/i.test(clean)
}
