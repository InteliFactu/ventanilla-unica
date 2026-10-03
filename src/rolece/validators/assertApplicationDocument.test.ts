import { describe, expect, it } from 'vitest'

import { applicationDocumentXml } from '../fixtures/applicationDocumentXml'
import { signingFixtures } from '../fixtures/signingFixtures'
import type { RegistrationQuery } from '../types/RegistrationQuery'
import { assertApplicationDocument } from './assertApplicationDocument'

const { nif, sender, email, document } = signingFixtures
const query: RegistrationQuery = {
  nif,
  comunidad: 'Extremadura',
  provincia: 'Cáceres',
  email,
  emailSolicitante: email,
}
const screen = (xml: string, holder = nif) => ({
  url: 'u',
  action: 'a',
  fields: { numDocumento: holder },
  document: xml,
})

describe('assertApplicationDocument', () => {
  it('accepts the planned operator, address and province', () => {
    expect(() => {
      assertApplicationDocument(screen(document), query, 'ES432')
    }).not.toThrow()
  })
  it('refuses another operator, holder, address or province', () => {
    const other = applicationDocumentXml({
      nif: 'B11111111',
      sender,
      email: 'x@y.es',
    })
    expect(() => {
      assertApplicationDocument(screen(other), query, 'ES432')
    }).toThrow('operator B11111111, notification address x@y.es')
    expect(() => {
      assertApplicationDocument(screen(document, 'B11111111'), query, 'ES431')
    }).toThrow('form holder B11111111, province ES432')
  })
})
