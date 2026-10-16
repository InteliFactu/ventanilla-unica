import { describe, expect, it } from 'vitest'

import { readRepresentative } from './readRepresentative'

describe('readRepresentative', () => {
  it('answers undefined when the page echoes no certificate holder', () => {
    expect(
      readRepresentative(
        '<form action="/site/invitado/confirmar-identificacion-invitado"><input type="hidden" name="personCertificationData.documentNumber" value=""/></form>',
        'https://sede.registradores.org/site/',
      ),
    ).toBeUndefined()
  })

  it('defaults the document type to NIF', () => {
    expect(
      readRepresentative(
        '<form action="/site/invitado/confirmar-identificacion-invitado"><input name="personCertificationData.documentNumber" value="00000000T"/></form>',
        'https://sede.registradores.org/site/',
      ),
    ).toMatchObject({ documentType: 'NIF', documentNumber: '00000000T' })
  })
})
