import { describe, expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpClient } from '../../http/types/HttpClient'
import type { ScriptedClientExtras } from '../../http/types/ScriptedClientExtras'
import { tussUrls } from '../session/tussUrls'
import { readInssContact } from './readInssContact'

const datos = `<form><p>CONTACTO</p>
<input type="text" id="prefijo" value="+34" class="inputLabelCommon__input"/>
<input type="text" id="movil" value="600000000" class="inputLabelCommon__input"/>
<input title="email" id="email" maxlength="40" value="" class="inputLabelCommon__input" /></form>`

const loggedInClient = (
  request: ScriptedClientExtras['request'],
  ...pages: string[]
): HttpClient => {
  for (const text of pages)
    request.mockResolvedValueOnce(htmlResponse(tussUrls.personalData, text))
  return { request, cookie: () => 'token' }
}

describe('readInssContact', () => {
  it('reads the mobile and e-mail of Tus datos after the login', async () => {
    const request = vi.fn<HttpClient['request']>()
    await expect(
      readInssContact(loggedInClient(request, '', datos)),
    ).resolves.toEqual({
      mobilePrefix: '+34',
      mobile: '600000000',
      email: null,
    })
    expect(request.mock.calls.map(([url]) => url)).toEqual([
      tussUrls.entry,
      tussUrls.personalData,
    ])
  })

  it('refuses a page without the contact block', async () => {
    await expect(
      readInssContact(
        loggedInClient(vi.fn<HttpClient['request']>(), '', '<p>Inicio</p>'),
      ),
    ).rejects.toThrow('no contact block')
  })
})
