import { describe, expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { confirmContactUpdate } from './confirmContactUpdate'
import { removeDehuContactEmail } from './removeDehuContactEmail'

vi.mock('../session/loginWithCertificate')
vi.mock('./confirmContactUpdate')

const jwt = `h.${Buffer.from(JSON.stringify({ username: '00000000T' })).toString('base64url')}.s`
const contact = (emails: string): ReturnType<typeof htmlResponse> =>
  htmlResponse(
    'https://dehu.redsara.es/api/v1/contact/x',
    `{"nif":"00000000T",${emails},"telefono":null,"noticeTime":"24x7","contactoPush":[]}`,
  )
const advisor = 'advisor@example.org'
const legalText = 'https://dehu.redsara.es/api/v1/get_legal_text/2/es'
const both =
  '"email1":"advisor@example.org","email1_confirmacion":1,"email2":"owner@example.org","email2_confirmacion":1'

describe('removeDehuContactEmail', () => {
  it('only reads without the confirmation', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue(jwt)
    const client = scriptedClient(contact(both))
    await expect(
      removeDehuContactEmail(client, advisor, false),
    ).resolves.toEqual({
      nif: '00000000T',
      removed: advisor,
      remaining: [{ email: 'owner@example.org', confirmed: true }],
      applied: false,
      verified: false,
    })
    expect(client.request.mock.calls).toHaveLength(1)
    expect(confirmContactUpdate).not.toHaveBeenCalled()
  })

  it('puts the new contact, walks the Cl@ve relay and reads it back', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue(jwt)
    const client = scriptedClient(
      contact(both),
      htmlResponse(legalText, '{"id":9}'),
      htmlResponse(
        'https://dehu.redsara.es/api/v1/contact/x',
        JSON.stringify(
          '<form action="https://clave.example/sp" method="post"><input name="SAMLRequest" value="r"></form>',
        ),
      ),
      contact('"email1":"owner@example.org","email1_confirmacion":1'),
    )
    const result = await removeDehuContactEmail(client, advisor, true)
    expect(result).toMatchObject({ applied: true, verified: true })
    const put = client.request.mock.calls[2]
    expect(put?.[0]).toBe('https://dehu.redsara.es/api/v1/contact/MDAwMDAwMDBU')
    expect(put?.[1]?.method).toBe('PUT')
    expect(JSON.parse(String(put?.[1]?.body))).toMatchObject({
      email1: 'owner@example.org',
      email1_confirmacion: 1,
      email2: null,
      legalTextId: 9,
    })
    expect(confirmContactUpdate).toHaveBeenCalledTimes(1)
  })

  it('fails when DEHU refuses the update', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue(jwt)
    const client = scriptedClient(
      contact(both),
      htmlResponse(legalText, '{"id":9}'),
      {
        ...htmlResponse('https://dehu.redsara.es/api/v1/contact/x', '{}'),
        status: 400,
      },
    )
    await expect(removeDehuContactEmail(client, advisor, true)).rejects.toThrow(
      'HTTP 400',
    )
  })
})
