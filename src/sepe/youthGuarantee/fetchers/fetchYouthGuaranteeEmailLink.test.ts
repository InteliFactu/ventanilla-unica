import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../../http/fixtures/scriptedClient'
import { fetchYouthGuaranteeEmailLink } from './fetchYouthGuaranteeEmailLink'

describe('email verification link trust boundary', () => {
  it.each([
    'https://example.test/token',
    'https://garantiajuvenil.sepe.es.evil.test/token',
    'http://garantiajuvenil.sepe.es/token',
    'https://secret@garantiajuvenil.sepe.es/token',
    'https://garantiajuvenil.sepe.es:444/token',
    'file:///private/token',
    'not-a-url',
  ])('refuses an unsafe initial link before any request', async (url) => {
    const client = scriptedClient()
    await expect(fetchYouthGuaranteeEmailLink(client, url)).rejects.toThrow(
      /refused email verification link/,
    )
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('follows validated administration redirects with GET on the same client', async () => {
    const start = 'https://garantiajuvenil.sepe.es/verify?token=synthetic'
    const target = 'https://sede.sepe.gob.es/confirmed'
    const client = scriptedClient(
      {
        ...htmlResponse(start, ''),
        status: 302,
        headers: { location: target },
      },
      htmlResponse(target, 'Confirmed'),
    )
    await fetchYouthGuaranteeEmailLink(client, start)
    expect(client.request.mock.calls).toEqual([
      [start, { followRedirects: false }],
      [target, { followRedirects: false }],
    ])
  })
  it('checks redirect targets before requesting them', async () => {
    const url = 'https://garantiajuvenil.sepe.es/verify?token=synthetic'
    const client = scriptedClient({
      ...htmlResponse(url, ''),
      status: 302,
      headers: { location: 'https://example.test/stolen' },
    })
    await expect(fetchYouthGuaranteeEmailLink(client, url)).rejects.toThrow(
      /refused email verification link/,
    )
    expect(client.request.mock.calls).toHaveLength(1)
  })
  it('does not retry a lost verification response or leak its URL', async () => {
    const client = scriptedClient()
    client.request.mockRejectedValueOnce(new Error('secret-token'))
    await expect(
      fetchYouthGuaranteeEmailLink(
        client,
        'https://garantiajuvenil.sepe.es/verify?token=synthetic',
      ),
    ).rejects.toThrow(
      'Garantía Juvenil: email verification request outcome is unverified; inspect the portal before retrying',
    )
    expect(client.request.mock.calls).toHaveLength(1)
  })
  it('refuses a failed link response', async () => {
    const url = 'https://garantiajuvenil.sepe.es/verify'
    const client = scriptedClient({
      ...htmlResponse(url, 'Unavailable'),
      status: 503,
    })
    await expect(fetchYouthGuaranteeEmailLink(client, url)).rejects.toThrow(
      /link failed/,
    )
  })
  it('stops a redirect loop', async () => {
    const url = 'https://garantiajuvenil.sepe.es/verify'
    const response = {
      ...htmlResponse(url, ''),
      status: 302,
      headers: { location: url },
    }
    const client = scriptedClient(...Array.from({ length: 11 }, () => response))
    await expect(fetchYouthGuaranteeEmailLink(client, url)).rejects.toThrow(
      /too many/,
    )
    expect(client.request.mock.calls).toHaveLength(11)
  })
})
