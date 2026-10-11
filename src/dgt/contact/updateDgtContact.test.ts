import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { dgtAtexAnswer } from '../fixtures/dgtAtexAnswer'
import { dgtJsonResponse } from '../fixtures/dgtJsonResponse'
import { dgtLoginResponses } from '../fixtures/dgtLoginResponses'
import { dgtUrls } from '../session/dgtUrls'
import { updateDgtContact } from './updateDgtContact'

const email = 'ana@example.es'
const query = {
  nif: '12345678Z',
  email,
  telefono: '0034600000000',
}
const none = {
  error: { errorCode: '001', errorMsg: 'No se encuentra ninguna información' },
}
const saved = { ok: { email, tel: '0034600000000' } }

describe('updateDgtContact', () => {
  it('only plans without confirmation: no form is posted to the sede', async () => {
    const client = scriptedClient(
      ...dgtLoginResponses(),
      dgtJsonResponse(dgtUrls.atex, dgtAtexAnswer),
      dgtJsonResponse(dgtUrls.saviSubscription, none),
    )
    const result = await updateDgtContact(client, query, { confirmed: false })
    expect(result).toMatchObject({
      submitted: false,
      titular: 'ANA PEREZ GIL',
      antes: undefined,
    })
    expect(result.request.fields).toMatchObject({
      txtEmail: email,
      telefono: '0034600000000',
    })
    const formPosts = client.request.mock.calls.filter(
      ([url, options]) =>
        url === dgtUrls.subscriptionsPage && options?.method === 'POST',
    )
    expect(formPosts).toHaveLength(0)
    expect(client.request.mock.calls).toHaveLength(5)
  })

  it('posts the form when confirmed and checks the data read back', async () => {
    const client = scriptedClient(
      ...dgtLoginResponses(),
      dgtJsonResponse(dgtUrls.atex, dgtAtexAnswer),
      dgtJsonResponse(dgtUrls.saviSubscription, none),
      htmlResponse(dgtUrls.subscriptionsPage, '<p>Datos actualizados</p>'),
      dgtJsonResponse(dgtUrls.saviSubscription, saved),
    )
    const result = await updateDgtContact(client, query, { confirmed: true })
    expect(result).toMatchObject({
      submitted: true,
      despues: { email, telefono: '0034600000000' },
    })
    const [url, options] = client.request.mock.calls[5] ?? []
    expect(url).toBe(dgtUrls.subscriptionsPage)
    expect(options?.method).toBe('POST')
    expect(options?.form).toMatchObject({
      'radio-all': 'radioAll',
      checkrgpd: 'on',
      update: 'true',
    })
  })

  it('refuses another holder and a read-back that does not match', async () => {
    const other = scriptedClient(
      ...dgtLoginResponses(),
      dgtJsonResponse(dgtUrls.atex, dgtAtexAnswer),
    )
    await expect(
      updateDgtContact(
        other,
        { ...query, nif: '87654321X' },
        { confirmed: true },
      ),
    ).rejects.toThrow('belongs to 12345678Z')
    const stale = scriptedClient(
      ...dgtLoginResponses(),
      dgtJsonResponse(dgtUrls.atex, dgtAtexAnswer),
      dgtJsonResponse(dgtUrls.saviSubscription, none),
      htmlResponse(dgtUrls.subscriptionsPage, '<p>Error</p>'),
      dgtJsonResponse(dgtUrls.saviSubscription, none),
    )
    await expect(
      updateDgtContact(stale, query, { confirmed: true }),
    ).rejects.toThrow('not what was sent')
  })
})
