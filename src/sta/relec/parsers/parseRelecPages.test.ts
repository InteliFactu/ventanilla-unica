import { describe, expect, it } from 'vitest'

import { relecFormHtml } from '../fixtures/relecFormHtml'
import { relecResultHtml } from '../fixtures/relecResultHtml'
import { relecSignPageHtml } from '../fixtures/relecSignPageHtml'
import { mapHexText } from '../mappers/mapHexText'
import { parseDocumentTypes } from './parseDocumentTypes'
import { parseHolderAddress } from './parseHolderAddress'
import { parseRelecForm } from './parseRelecForm'
import { parseRelecResult } from './parseRelecResult'
import { parseSignPage } from './parseSignPage'

const sta = 'https://sede.caceres.es/sta/Relec/'

describe('Relec page parsers', () => {
  it('reads the form: holder, represented, contact and selected address', () => {
    const form = parseRelecForm(relecFormHtml, `${sta}TramitaForm`)
    expect(form.holder).toEqual({ name: 'ANA LOPEZ RUIZ', nif: '12345678Z' })
    expect(form.represented).toMatchObject([
      {
        dboid: '2000400050000000000001',
        personType: 'RJ',
        name: 'EJEMPLO SL',
        nif: 'B12345678',
      },
    ])
    expect(form.contact).toEqual({
      email: 'ana@example.es',
      phone: '600000000',
    })
    expect(form.address).toEqual({
      id: '1009000000000000000001',
      fields: {
        pais: 'ESPAÑA',
        provincia: 'CACERES',
        codigopostal: '10001',
        municipio: 'CACERES',
        calle: 'MAYOR & SOL',
        kmcalleText: '7',
        kmcalle: '7',
        indKmCode: 'NUM',
        bloque: ' ',
        tipoVia: 'CALLE',
      },
    })
    expect(form.defaultStreetType).toBe('ALMDA')
    expect(form.fields['solicituddesc']).toBe('Aportación de documentación ')
  })

  it('submits a new, empty address when the script selects none, and refuses a page without the form', () => {
    expect(parseHolderAddress('<p></p>')).toEqual({ id: 'new', fields: {} })
    expect(() => parseRelecForm('<p>Error</p>', `${sta}TramitaForm`)).toThrow(
      'TramitaForm carried no TramitaSign form',
    )
  })

  it('reads the signing ids and the TramitaJustif form', () => {
    const page = parseSignPage(relecSignPageHtml, `${sta}TramitaSign`)
    expect(page.inFileId).toBe(
      [
        'recoverParaFirma',
        'firmar',
        'ABCDEF0123',
        '6269000000002829307935Form.xml',
      ]
        .map(mapHexText)
        .join(':'),
    )
    expect(page.outFileId).toBe(
      '6a7573746966:41424344454630313233:36323639303030303030303032383239333037393335',
    )
    expect(page.fileName).toBe('formulario_tramite.xml')
    expect(page.justif.action).toBe(`${sta}TramitaJustif`)
    expect(() =>
      parseSignPage('<p>Faltan datos</p>', `${sta}TramitaSign`),
    ).toThrow('TramitaSign did not answer the signing page')
  })

  it('reads the CSV, the NIF and a registry number when the page names one', () => {
    expect(
      parseRelecResult(relecResultHtml, `${sta}TramitaJustif`).registryNumber,
    ).toBeUndefined()
    expect(
      parseRelecResult(
        `${relecResultHtml}<p>ENT2026000123</p>`,
        `${sta}TramitaJustif`,
      ).registryNumber,
    ).toBe('ENT2026000123')
    expect(() =>
      parseRelecResult('<p>Error</p>', `${sta}TramitaJustif`),
    ).toThrow('TramitaJustif answered no justificante CSV')
  })

  it('refuses a type list without types', () => {
    expect(() => parseDocumentTypes('({"resultado":[]})')).toThrow(
      'no usable document types',
    )
  })
})
