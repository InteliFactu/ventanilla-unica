import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { registradoresLoginPages } from '../fixtures/registradoresLoginPages'
import { openRegistradoresSession } from './openRegistradoresSession'

describe('openRegistradoresSession', () => {
  it('posts each SAML hop with a Referer and answers the search csrf', async () => {
    const client = scriptedClient(...registradoresLoginPages())
    await expect(openRegistradoresSession(client)).resolves.toBe('csrf-1')
    expect(client.request.mock.calls[1]?.[0]).toBe(
      'https://sso.registradores.org/saml/idp/profile/redirectorpost/sso',
    )
    expect(client.request.mock.calls[1]?.[1]?.referer).toBe(
      'https://api-sede-pub-auth.registradores.org/sede-corpme-core/saml2/authenticate/f5',
    )
  })

  it('refuses a login that does not reach the search', async () => {
    const pages = registradoresLoginPages()
    pages[5] = htmlResponse(
      'https://sede.registradores.org/sede/home?x=1',
      '<p/>',
    )
    await expect(
      openRegistradoresSession(scriptedClient(...pages)),
    ).rejects.toThrow('landed on https://sede.registradores.org/sede/home)')
  })
})
