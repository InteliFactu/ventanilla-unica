import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { tgviMenuPage } from '../bulkFiling/fixtures/tgviMenuPage'
import { actAsAeatHolder } from './actAsAeatHolder'

vi.mock('../../certificate/certificateNifs', () => ({
  certificateNifs: () => ['00000000T'],
}))

const identity = { cert: Buffer.alloc(0), key: Buffer.alloc(0) }

const clientActingAs = (acting: string) => {
  const request = vi.fn(
    async (url: string, _options?: HttpRequestOptions): Promise<HttpResponse> =>
      Promise.resolve({
        status: 200,
        url,
        headers: {},
        body: Buffer.alloc(0),
        text: url.endsWith('/DialogoRepresentacion')
          ? tgviMenuPage('00000000T', acting)
          : '',
      }),
  )
  const client: HttpClient = { request, cookie: () => undefined }
  return { client, request }
}

describe('actAsAeatHolder', () => {
  it('does nothing for the certificate holder', async () => {
    const { client, request } = clientActingAs('')
    await actAsAeatHolder(client, identity, '00000000T', undefined)
    expect(request).not.toHaveBeenCalled()
  })

  it('needs the holder name to switch', async () => {
    const { client } = clientActingAs('')
    await expect(
      actAsAeatHolder(client, identity, 'B00000000', undefined),
    ).rejects.toThrow('--nombre is required to act for B00000000')
  })

  it('posts the representation dialog and checks whom the session acts for', async () => {
    const { client, request } = clientActingAs('B00000000')
    await actAsAeatHolder(client, identity, 'B00000000', 'ACME SL')
    const post = request.mock.calls.find(([url]) =>
      url.endsWith('/OVCT-CXEW/DialogoRepresentacion'),
    )
    expect(post?.[1]).toMatchObject({ method: 'POST' })
    const body = String(post?.[1]?.body)
    expect(body).toContain('nif=B00000000')
    expect(body).toContain('nombre=ACME+SL')
    expect(body).toContain('representacion=representante')
    expect(body).toContain('ref=%2Fwlpl%2FTEWV-CORE%2FResumenVlt')
  })

  it('refuses a switch the AEAT did not grant', async () => {
    const { client } = clientActingAs('')
    await expect(
      actAsAeatHolder(client, identity, 'B00000000', 'ACME SL'),
    ).rejects.toThrow('acts for 00000000T, not for B00000000')
  })
})
