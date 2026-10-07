import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { fetchAppearanceLoginForm } from './fetchAppearanceLoginForm'

const json = (value: unknown): HttpResponse => {
  const text = JSON.stringify(value)
  return { status: 200, url: '', headers: {}, body: Buffer.from(text), text }
}

const sessionWith = (
  answer: HttpResponse,
): {
  request: ReturnType<typeof vi.fn<HttpClient['request']>>
  client: HttpClient
} => {
  const request = vi.fn<HttpClient['request']>().mockResolvedValue(answer)
  return { request, client: { request, cookie: () => undefined } }
}

describe('fetchAppearanceLoginForm', () => {
  it('asks for the form of the reference and legal text and parses it', async () => {
    const html =
      '<form method="post" id="claveform" action="https://pasarela.clave.gob.es/Proxy2/ServiceProvider"><input type="hidden" name="SAMLRequest" value="REQ"></form>'
    const { request, client } = sessionWith(json(html))
    const form = await fetchAppearanceLoginForm(
      { client, authData: 'JWT', legalTextId: '901' },
      'REF1',
    )
    expect(request.mock.calls[0]?.[0]).toBe(
      'https://dehu.redsara.es/api/v1/notifications/REF1/appearance-login-form/aceptar/901',
    )
    expect(form.action).toBe(
      'https://pasarela.clave.gob.es/Proxy2/ServiceProvider',
    )
    expect(form.fields['SAMLRequest']).toBe('REQ')
  })

  it('fails when the answer is not a form', async () => {
    const { client } = sessionWith(json({ error: 'x' }))
    await expect(
      fetchAppearanceLoginForm(
        { client, authData: 'JWT', legalTextId: '901' },
        'REF1',
      ),
    ).rejects.toThrow('no Cl@ve form')
  })
})
