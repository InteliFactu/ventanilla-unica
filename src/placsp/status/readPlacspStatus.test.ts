import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { registrationPageHtml } from '../fixtures/registrationPageHtml'
import { readPlacspStatus } from './readPlacspStatus'

const url = 'https://contrataciondelestado.es/wps/portal/registrarse'

describe('readPlacspStatus', () => {
  it('posts only the availability button and reads a free e-mail', async () => {
    const client = scriptedClient(
      htmlResponse(url, registrationPageHtml()),
      htmlResponse(
        url,
        registrationPageHtml({ free: 'Id usuario y email permitidos.' }),
      ),
    )
    const result = await readPlacspStatus(client, 'info@example.com')
    expect(result.account).toBe('none')
    const form = client.request.mock.calls[1]?.[1]?.form ?? {}
    expect(form['viewns_Z7_TEST_:form1:idEmail']).toBe('info@example.com')
    expect(form['viewns_Z7_TEST_:form1:idUsu']).toMatch(/^vu[\da-f]{12}$/)
    expect(
      form['viewns_Z7_TEST_:form1:buttonComprobarDisponibilidad'],
    ).toBeDefined()
    expect(form['viewns_Z7_TEST_:form1:button03_3']).toBeUndefined()
    expect(form['viewns_Z7_TEST_:form1:idContrasenyaReal']).toBeUndefined()
    expect(form['javax.faces.ViewState']).toBe('state')
  })

  it('refuses a missing e-mail and a page without the form', async () => {
    await expect(readPlacspStatus(scriptedClient(), undefined)).rejects.toThrow(
      '--email is required',
    )
    await expect(
      readPlacspStatus(scriptedClient(htmlResponse(url, '<p/>')), 'a@b.es'),
    ).rejects.toThrow('no registration form')
  })
})
