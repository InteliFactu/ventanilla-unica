import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { loginToImportass } from './loginToImportass'

const page = (url: string, text: string): HttpResponse => ({
  status: 200,
  url,
  headers: {},
  body: Buffer.alloc(0),
  text,
})

const loginPage = page(
  'https://portal.seg-social.gob.es/wps/portal/importass/!ut/p/z0/A/',
  '<base href="https://portal.seg-social.gob.es/wps/portal/importass/!ut/p/z1/B/"><form id="P017_login" action="p0/IZ=LA0=/#Z7"><input name="loginFormSubmit" value="ACCESO"></form>',
)
const samlHop = page(
  'https://portal.seg-social.gob.es/x',
  '<form action="https://idp.seg-social.es/PGIS/Login"><input name="SAMLRequest" value="r"></form>',
)
const chooser = page(
  'https://idp.seg-social.es/PGIS/Login',
  '<base href="/PGIS"><form name="volverForm" action="Login?volver=volver"></form><a href="Login?seleccion=IPCE">Certificado</a>',
)

describe('loginToImportass', () => {
  it('walks the login form, the SAML hops and the chooser until LtpaToken2 is set', async () => {
    let ltpa: string | undefined
    const request = vi
      .fn()
      .mockResolvedValueOnce(loginPage)
      .mockResolvedValueOnce(samlHop)
      .mockResolvedValueOnce(chooser)
      .mockImplementationOnce(async () => {
        ltpa = 'token'
        return await Promise.resolve(
          page('https://portal.seg-social.gob.es/wps/myportal/x', ''),
        )
      })
    const client: HttpClient = { request, cookie: () => ltpa }
    await loginToImportass(client)
    expect(request.mock.calls[1]?.[0]).toBe(
      'https://portal.seg-social.gob.es/wps/portal/importass/!ut/p/z1/B/p0/IZ=LA0=/',
    )
    expect(request.mock.calls[3]?.[0]).toBe(
      'https://idp.seg-social.es/PGIS/Login?seleccion=IPCE',
    )
  })

  it('stops on a page that is neither a relay hop nor the chooser', async () => {
    const client: HttpClient = {
      request: vi
        .fn()
        .mockResolvedValue(
          page('https://portal.seg-social.gob.es/e', '<p>error</p>'),
        ),
      cookie: () => undefined,
    }
    await expect(loginToImportass(client)).rejects.toThrow(/login stopped/)
  })

  it('gives up after too many hops without the token', async () => {
    const client: HttpClient = {
      request: vi.fn().mockResolvedValue(samlHop),
      cookie: () => undefined,
    }
    await expect(loginToImportass(client)).rejects.toThrow(/no LtpaToken2/)
  })
})
