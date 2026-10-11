import { describe, expect, it } from 'vitest'

import { personalDataHtml } from '../fixtures/personalDataHtml'
import { parsePersonalDataPage } from './parsePersonalDataPage'

const url =
  'https://portal.seg-social.gob.es/wps/myportal/importass/importass/tramites/datospersonales'

describe('parsePersonalDataPage', () => {
  it('reads identity, contact data and domicile, and resolves the forms against <base>', () => {
    const page = parsePersonalDataPage(personalDataHtml(), url)
    expect(page.data).toEqual({
      name: 'Persona Ejemplo Prueba',
      birthDate: '1 de enero de 2000',
      identifier: '00000000T',
      naf: '280000000000',
      landline: '',
      mobilePrefix: '+34',
      mobile: '600111222',
      email: 'persona@example.org',
      address: {
        lines: ['Cl. MAYOR 5, piso 2, pta. B', '28001, MADRID'],
        pais: '724',
        tipoVia: 'CL',
        nombreVia: 'MAYOR',
        numero: '5',
        bis: '',
        bloque: '',
        escalera: '',
        piso: '2',
        puerta: 'B',
        codigoPostal: '28001',
        localidad: 'MADRID',
      },
    })
    expect(page.contactForm.action).toBe(
      'https://portal.seg-social.gob.es/wps/myportal/importass/importass/tramites/datospersonales/inicio/!ut/p/z1/AAA/p0/IZ7_X=CZ6_Y=LAcontacto=/#Z7_X',
    )
  })

  it('refuses a page without the edit forms', () => {
    expect(() => parsePersonalDataPage('<html><dl></dl></html>', url)).toThrow(
      /no edit forms/,
    )
  })
})
