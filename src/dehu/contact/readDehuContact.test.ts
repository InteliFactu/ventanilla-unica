import { describe, expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { readJwtUsername } from './parsers/readJwtUsername'
import { readDehuContact } from './readDehuContact'

vi.mock('../session/loginWithCertificate')

const jwt = (payload: object): string =>
  `h.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.s`

describe('readDehuContact', () => {
  it('reads the holder from the session token', () => {
    expect(readJwtUsername(jwt({ username: '00000000T' }))).toBe('00000000T')
    expect(() => readJwtUsername('x')).toThrow('names no holder')
  })

  it('asks for the base64 NIF and maps the emails', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue(
      jwt({ username: '00000000T' }),
    )
    const client = scriptedClient(
      htmlResponse(
        'https://dehu.redsara.es/api/v1/contact/x',
        '{"nif":"00000000T","email1":"ana@example.org","email1_confirmacion":1,"email2":"b@example.org","email2_confirmacion":null,"telefono":null,"noticeTime":"24x7","updatedAt":"2026-01-01"}',
      ),
    )
    await expect(readDehuContact(client)).resolves.toEqual({
      nif: '00000000T',
      emails: [
        { email: 'ana@example.org', confirmed: true },
        { email: 'b@example.org', confirmed: false },
      ],
      phone: null,
      noticeTime: '24x7',
      updatedAt: '2026-01-01',
    })
    expect(client.request.mock.calls[0]?.[0]).toBe(
      'https://dehu.redsara.es/api/v1/contact/MDAwMDAwMDBU',
    )
  })

  it('fails on a refused contact call', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue(
      jwt({ username: '00000000T' }),
    )
    const client = scriptedClient({
      ...htmlResponse('https://dehu.redsara.es/api/v1/contact/x', '{}'),
      status: 403,
    })
    await expect(readDehuContact(client)).rejects.toThrow('HTTP 403')
  })
})
