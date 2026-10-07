import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { authenticateFromServiceProvider } from './authenticateFromServiceProvider'

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

describe('authenticateFromServiceProvider', () => {
  it('posts straight to AuthenticateCitizen when Cl@ve skips the chooser', async () => {
    const identity = page(authenticateUrl, 'identity')
    const request = vi.fn<HttpClient['request']>().mockResolvedValue(identity)
    const client: HttpClient = { request, cookie: () => undefined }
    const servicePage = page(
      serviceProviderUrl,
      `<form action=""></form><form action="${authenticateUrl}"><input type="hidden" name="SAMLRequest" value="R"></form>`,
    )
    await expect(
      authenticateFromServiceProvider(client, servicePage),
    ).resolves.toBe(identity)
    expect(request.mock.calls[0]?.[0]).toBe(authenticateUrl)
    expect(request.mock.calls[0]?.[1]?.form).toEqual({ SAMLRequest: 'R' })
  })

  it('picks the certificate provider when the chooser is shown', async () => {
    const redirect = page(
      'https://pasarela.clave.gob.es/Proxy2/ServiceRedirect',
      `<form action="${authenticateUrl}"><input type="hidden" name="SAMLRequest" value="R2"></form>`,
    )
    const identity = page(authenticateUrl, 'identity')
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValueOnce(redirect)
      .mockResolvedValueOnce(identity)
    const client: HttpClient = { request, cookie: () => undefined }
    const chooser = page(
      serviceProviderUrl,
      '<form name="idpRedirect" action="https://pasarela.clave.gob.es/Proxy2/ServiceRedirect"><input type="hidden" name="SAMLRequest" value="R1"></form>',
    )
    await expect(
      authenticateFromServiceProvider(client, chooser),
    ).resolves.toBe(identity)
    expect(request.mock.calls[0]?.[1]?.form?.['SelectedIdP']).toBe('AFIRMA')
  })

  it('fails when neither shape is there', async () => {
    const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
    await expect(
      authenticateFromServiceProvider(client, page(serviceProviderUrl, '<p>')),
    ).rejects.toThrow('no Cl@ve form')
  })
})
