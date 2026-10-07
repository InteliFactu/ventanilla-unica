import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { reauthenticateForAppearance } from './reauthenticateForAppearance'

const page = (url: string, text: string): HttpResponse => ({
  status: 200,
  url,
  headers: {},
  body: Buffer.from(text),
  text,
})

const serviceProviderUrl =
  'https://pasarela.clave.gob.es/Proxy2/ServiceProvider'
const authenticateUrl =
  'https://pasarela-ident.clave.gob.es/IdP2/AuthenticateCitizen'
const responseRedirectUrl =
  'https://pasarela.clave.gob.es/Proxy2/ResponseRedirect'
const checkUrl =
  'https://dehu.redsara.es/api/v1/notifications/HASH/appearance-login-check?selectedLanguage=es'

const relay = (location: string | undefined): HttpClient['request'] =>
  vi
    .fn<HttpClient['request']>()
    .mockResolvedValueOnce(
      page(
        'https://dehu.redsara.es/api/v1/notifications/REF1/appearance-login-form/aceptar/901',
        JSON.stringify(
          `<form id="claveform" action="${serviceProviderUrl}"><input type="hidden" name="SAMLRequest" value="R1"></form>`,
        ),
      ),
    )
    .mockResolvedValueOnce(
      page(
        serviceProviderUrl,
        `<form action="${authenticateUrl}"><input type="hidden" name="SAMLRequest" value="R2"></form>`,
      ),
    )
    .mockResolvedValueOnce(
      page(
        authenticateUrl,
        `<form action="${responseRedirectUrl}"><input type="hidden" name="SAMLResponse" value="S1"></form>`,
      ),
    )
    .mockResolvedValueOnce(
      page(
        responseRedirectUrl,
        `<form action="${checkUrl}"><input type="hidden" name="SAMLResponse" value="S2"></form>`,
      ),
    )
    .mockResolvedValueOnce({
      status: 302,
      url: checkUrl,
      headers: location === undefined ? {} : { location },
      body: Buffer.from(''),
      text: '',
    })

describe('reauthenticateForAppearance', () => {
  it('walks the second relay and returns its fresh authData', async () => {
    const request = relay(
      '/es/notificaciones-pendientes/aceptar/REF1/login?authData=NEWJWT',
    )
    const client: HttpClient = { request, cookie: () => undefined }
    await expect(
      reauthenticateForAppearance(
        { client, authData: 'OLD', legalTextId: '901' },
        'REF1',
      ),
    ).resolves.toBe('NEWJWT')
    expect(request).toHaveBeenCalledTimes(5)
  })

  it('fails when appearance-login-check hands back no authData', async () => {
    const client: HttpClient = {
      request: relay('/es/error'),
      cookie: () => undefined,
    }
    await expect(
      reauthenticateForAppearance(
        { client, authData: 'OLD', legalTextId: '901' },
        'REF1',
      ),
    ).rejects.toThrow('no authData')
  })
})
