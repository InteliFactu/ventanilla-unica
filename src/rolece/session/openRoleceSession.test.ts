import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { roleceLoginPages } from '../fixtures/roleceLoginPages'
import { openRoleceSession } from './openRoleceSession'

describe('openRoleceSession', () => {
  it('walks the Cl@ve relay to the private home', async () => {
    const client = scriptedClient(...roleceLoginPages())
    await expect(openRoleceSession(client)).resolves.toBeUndefined()
    expect(client.request.mock.calls[1]?.[0]).toBe(
      'https://pasarela.clave.gob.es/Proxy2/ServiceProvider',
    )
    expect(client.request.mock.calls[2]?.[0]).toBe(
      'https://pasarela-ident.clave.gob.es/IdP2/AuthenticateCitizen',
    )
  })

  it('answers the IdP chooser with the certificate when it appears', async () => {
    const pages = roleceLoginPages()
    pages[1] = htmlResponse(
      'https://pasarela.clave.gob.es/Proxy2/ServiceProvider',
      '<form name="idpRedirect" action="ServiceRedirect"><input type="hidden" name="SelectedIdP" value=""/></form>',
    )
    pages[2] = htmlResponse('https://pasarela.clave.gob.es/x', '<p>ok</p>')
    const client = scriptedClient(...pages)
    await openRoleceSession(client)
    expect(client.request.mock.calls[2]?.[1]?.form).toMatchObject({
      SelectedIdP: 'AFIRMA',
    })
  })

  it('refuses a login page without a form or a session without logout', async () => {
    const empty = htmlResponse('https://registrodelicitadores.gob.es/', '<p/>')
    await expect(openRoleceSession(scriptedClient(empty))).rejects.toThrow(
      'no Cl@ve entry form',
    )
    const pages = roleceLoginPages()
    pages[3] = empty
    await expect(openRoleceSession(scriptedClient(...pages))).rejects.toThrow(
      'did not open a session',
    )
  })
})
