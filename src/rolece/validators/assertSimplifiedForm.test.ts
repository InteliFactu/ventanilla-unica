import { describe, expect, it } from 'vitest'

import { assertSimplifiedForm } from './assertSimplifiedForm'

const form = (
  fields: Record<string, string>,
): { action: string; fields: Record<string, string> } => ({
  action:
    'https://registrodelicitadores.gob.es/rolece/comun/inscripcionPersonaF.action',
  fields,
})
const simplified = {
  solicitudSimplificada: 'true',
  numDocumento: 'B00000000',
  tipoComunidad: 'ES43',
  'method:enviarSolicitud': 'Firmar y Enviar Solicitud',
}

describe('assertSimplifiedForm', () => {
  it('accepts the simplified screen for the same operator and comunidad', () => {
    expect(() => {
      assertSimplifiedForm(form(simplified), 'B00000000', 'ES43')
    }).not.toThrow()
  })

  it('refuses another operator, another comunidad or a missing button', () => {
    expect(() => {
      assertSimplifiedForm(form(simplified), 'B00000000', 'ES61')
    }).toThrow('not B00000000 in ES61')
    const { 'method:enviarSolicitud': _button, ...noButton } = simplified
    expect(() => {
      assertSimplifiedForm(form(noButton), 'B00000000', 'ES43')
    }).toThrow('no "Firmar y Enviar Solicitud" button')
  })
})
