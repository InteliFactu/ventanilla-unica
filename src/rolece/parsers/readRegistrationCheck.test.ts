import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { applicationFormHtml } from '../fixtures/applicationFormHtml'
import { readRegistrationCheck } from './readRegistrationCheck'

const page = (
  fields: Record<string, string>,
): ReturnType<typeof htmlResponse> =>
  htmlResponse(
    'https://registrodelicitadores.gob.es/rolece/comun/inscripcionPersonaF.action',
    applicationFormHtml(fields),
  )

describe('readRegistrationCheck', () => {
  it('reads an operator due for an initial application', () => {
    expect(
      readRegistrationCheck(
        page({
          numDocumento: 'B00000000',
          solicitudInicial: 'true',
          inscrito: 'false',
        }),
        'B00000000',
      ),
    ).toEqual({
      nif: 'B00000000',
      inscribed: false,
      initialApplication: true,
      pendingApplication: false,
    })
  })

  it('reads an application already pending', () => {
    const pending = htmlResponse(
      'https://registrodelicitadores.gob.es/rolece/comun/inscripcionPersonaF.action',
      `<p>Ya existe una solicitud para este operador econ&oacute;mico pendiente de recibir los datos del Registro Mercantil</p>${applicationFormHtml({ numDocumento: 'B00000000', solicitudInicial: '', inscrito: 'false' })}`,
    )
    expect(readRegistrationCheck(pending, 'B00000000')).toMatchObject({
      initialApplication: false,
      pendingApplication: true,
    })
  })

  it('refuses an answer about another operator or a page without the form', () => {
    expect(() =>
      readRegistrationCheck(page({ numDocumento: 'A00000000' }), 'B00000000'),
    ).toThrow('answered for A00000000')
    expect(() =>
      readRegistrationCheck(
        htmlResponse('https://registrodelicitadores.gob.es/x', '<p/>'),
        'B00000000',
      ),
    ).toThrow('no application form')
  })
})
