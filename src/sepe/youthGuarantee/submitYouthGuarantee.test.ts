import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { youthGuaranteeAnswers } from './fixtures/youthGuaranteeAnswers'
import { youthGuaranteePage } from './fixtures/youthGuaranteePage'
import { submitYouthGuarantee } from './submitYouthGuarantee'
import { youthGuaranteeUrls } from './youthGuaranteeUrls'

describe('inscription submission boundary (synthetic HTTP only)', () => {
  it('refuses an unconfirmed caller before any request', async () => {
    const client = scriptedClient()
    await expect(
      submitYouthGuarantee(client, youthGuaranteeAnswers, false),
    ).rejects.toThrow(/requires --confirmar/)
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('refuses a changed action before sending answers', async () => {
    const client = scriptedClient(
      htmlResponse(
        youthGuaranteeUrls.page(1),
        youthGuaranteePage(1).replace(
          '/solicitudPaso1Token.action',
          'https://sede.sepe.gob.es/other',
        ),
      ),
    )
    await expect(
      submitYouthGuarantee(client, youthGuaranteeAnswers, true),
    ).rejects.toThrow(/action or CSRF/)
    expect(client.request.mock.calls).toHaveLength(1)
  })
  it('stops after one sent step when the portal returns validation errors', async () => {
    const client = scriptedClient(
      htmlResponse(youthGuaranteeUrls.page(1), youthGuaranteePage(1)),
      htmlResponse(youthGuaranteeUrls.page(1), youthGuaranteePage(1)),
    )
    await expect(
      submitYouthGuarantee(client, youthGuaranteeAnswers, true),
    ).rejects.toThrow(/step 1 was sent.*Do not retry/)
    expect(client.request.mock.calls).toHaveLength(2)
  })
  it('does not retry after a lost response', async () => {
    const client = scriptedClient(
      htmlResponse(youthGuaranteeUrls.page(1), youthGuaranteePage(1)),
    )
    client.request.mockRejectedValueOnce(new Error('socket closed'))
    await expect(
      submitYouthGuarantee(client, youthGuaranteeAnswers, true),
    ).rejects.toThrow(/step 1 was sent/)
    expect(client.request.mock.calls).toHaveLength(2)
  })
  it('does not follow a foreign redirect after a submission', async () => {
    const redirect = {
      ...htmlResponse(youthGuaranteeUrls.page(1), ''),
      status: 302,
      headers: { location: 'https://sede.sepe.gob.es/unexpected' },
    }
    const client = scriptedClient(
      htmlResponse(youthGuaranteeUrls.page(1), youthGuaranteePage(1)),
      redirect,
    )
    await expect(
      submitYouthGuarantee(client, youthGuaranteeAnswers, true),
    ).rejects.toThrow(/outcome is unverified/)
    expect(client.request.mock.calls).toHaveLength(2)
  })
  it('does not call a signature page a registered inscription', async () => {
    const client = scriptedClient(
      htmlResponse(youthGuaranteeUrls.page(1), youthGuaranteePage(1)),
      ...Array.from({ length: 5 }, (_, index) =>
        htmlResponse(
          youthGuaranteeUrls.page(index + 2),
          youthGuaranteePage(index + 2),
        ),
      ),
      htmlResponse(
        youthGuaranteeUrls.page(6),
        '<a href="./logout">Salir</a><h1>Firmar solicitud</h1>',
      ),
    )
    expect(
      await submitYouthGuarantee(client, youthGuaranteeAnswers, true),
    ).toMatchObject({ registered: false, registrationNumber: null })
  })
})
