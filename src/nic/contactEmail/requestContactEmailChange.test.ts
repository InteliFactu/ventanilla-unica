import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { requestContactEmailChange } from './requestContactEmailChange'

const form = htmlResponse(
  'https://www.nic.es/sgnd/peticion/editCorreo.action',
  '<form id="editarContacto"><textarea name="unsignedData" id="unsignedData" style="display: none">0123456789abcdef0123456789abcdef</textarea></form>',
)
const query = { identificador: '1A2B3C-ESNIC-F5', email: 'nuevo@example.es' }
const identity = buildTestIdentity()

describe('requestContactEmailChange', () => {
  it('posts nothing without confirmation', async () => {
    const client = scriptedClient(
      form,
      htmlResponse(
        'https://www.nic.es/sgnd/peticion/esPersonaJuridica.action',
        'false',
      ),
    )
    const result = await requestContactEmailChange(client, query, {
      identity,
      confirmed: false,
    })
    expect(result).toEqual({ ...query, submitted: false })
    expect(client.request.mock.calls).toHaveLength(2)
    for (const [, options] of client.request.mock.calls)
      expect(options?.method).not.toBe('POST')
  })

  it('refuses a legal person, whose change needs powers', async () => {
    const client = scriptedClient(
      form,
      htmlResponse(
        'https://www.nic.es/sgnd/peticion/esPersonaJuridica.action',
        'true',
      ),
    )
    await expect(
      requestContactEmailChange(client, query, { identity, confirmed: true }),
    ).rejects.toThrow('legal person')
  })

  it('posts the signed request and returns the registry answer', async () => {
    const client = scriptedClient(
      form,
      htmlResponse(
        'https://www.nic.es/sgnd/peticion/esPersonaJuridica.action',
        'false',
      ),
      htmlResponse(
        'https://www.nic.es/sgnd/peticion/editarContacto.action',
        '<h1>Petición realizada</h1><p>La petición de cambio de email ha sido realizada con éxito.</p>',
      ),
    )
    const result = await requestContactEmailChange(client, query, {
      identity,
      confirmed: true,
    })
    expect(result.message).toBe(
      'La petición de cambio de email ha sido realizada con éxito.',
    )
    const [url, options] = client.request.mock.calls[2] ?? []
    expect(url).toContain('editarContacto.action')
    const body = options?.body?.toString() ?? ''
    expect(body).toContain('name="identificador"\r\n\r\n1A2B3C-ESNIC-F5')
    expect(body).toContain(
      'name="confCorreoElectronico"\r\n\r\nnuevo@example.es',
    )
    expect(body).toContain(
      'name="unsignedData"\r\n\r\n0123456789abcdef0123456789abcdef',
    )
    expect(body).toContain('name="poderes"; filename=""')
  })
})
