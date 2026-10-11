import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { buildAuthorizationUrl } from './builders/buildAuthorizationUrl'
import { buildPkcePair } from './builders/buildPkcePair'
import { loginWithCertificate } from './loginWithCertificate'
import { readAuthorizationCode } from './parsers/readAuthorizationCode'
import { readStringField } from './parsers/readStringField'
import { walkClaveToSignin } from './walkClaveToSignin'

const signin = 'https://carpetaciudadana.gob.es/signin'

describe('carpeta session', () => {
  it('builds a PKCE pair whose challenge differs from the verifier', () => {
    const pair = buildPkcePair()
    expect(pair.verifier).toHaveLength(43)
    expect(pair.challenge).not.toBe(pair.verifier)
    const url = new URL(
      buildAuthorizationUrl({ verifier: 'v', challenge: 'c', state: 's' }),
    )
    expect(url.searchParams.get('acr_values')).toBe('loa:2 idp:AFIRMA')
    expect(url.searchParams.get('code_challenge')).toBe('c')
  })

  it('reads the code only when the state matches', () => {
    expect(readAuthorizationCode(`${signin}?state=s&code=k`, 's')).toBe('k')
    expect(() =>
      readAuthorizationCode(`${signin}?state=x&code=k`, 's'),
    ).toThrow('did not return an authorization code')
  })

  it('reads a string field or names the missing one', () => {
    expect(readStringField('{"token":"t"}', 'token', 'x')).toBe('t')
    expect(() => readStringField('<html>', 'token', 'x')).toThrow('no token')
  })

  it('answers the chooser with the certificate IdP and stops on /signin', async () => {
    const chooser = htmlResponse(
      'https://pasarela.clave.gob.es/Proxy2/ServiceProvider',
      '<form id="idpRedirect" action="/Proxy2/ServiceRedirect" method="post"><input type="hidden" name="SelectedIdP" value=""></form>',
    )
    const client = scriptedClient(htmlResponse(`${signin}?code=k`, ''))
    const landed = await walkClaveToSignin(client, chooser)
    expect(landed.url).toContain('/signin')
    const [url, options] = client.request.mock.calls[0] ?? []
    expect(url).toBe('https://pasarela.clave.gob.es/Proxy2/ServiceRedirect')
    expect(options?.form).toMatchObject({ SelectedIdP: 'AFIRMA' })
  })

  it('throws when the relay stops elsewhere', async () => {
    await expect(
      walkClaveToSignin(
        scriptedClient(),
        htmlResponse('https://pasarela.clave.gob.es/x', '<p>error</p>'),
      ),
    ).rejects.toThrow('did not come back')
  })

  it('trades the code for the Carpeta token', async () => {
    const client = scriptedClient()
    client.request.mockImplementationOnce(async (url: string) => {
      const state = new URL(url).searchParams.get('state') ?? ''
      return Promise.resolve(
        htmlResponse(`${signin}?state=${state}&code=k`, ''),
      )
    })
    client.request.mockResolvedValueOnce(
      htmlResponse('https://auth-api.redsara.es/token', '{"access_token":"a"}'),
    )
    client.request.mockResolvedValueOnce(
      htmlResponse('https://carpetaciudadana.gob.es/t', '{"token":"cc"}'),
    )
    await expect(loginWithCertificate(client)).resolves.toBe('cc')
  })
})
