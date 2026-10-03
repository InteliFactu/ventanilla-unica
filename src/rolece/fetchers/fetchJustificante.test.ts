import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { filingReceiptHtml } from '../fixtures/filingReceiptHtml'
import { fetchJustificante } from './fetchJustificante'

const receipt = htmlResponse(
  'https://registrodelicitadores.gob.es/rolece/comun/x',
  filingReceiptHtml,
)

describe('fetchJustificante', () => {
  it('answers the ZIP, or undefined for anything else', async () => {
    const zip = {
      ...htmlResponse('u', ''),
      body: Buffer.from('PK\u0003\u0004'),
    }
    expect(await fetchJustificante(scriptedClient(zip), receipt)).toEqual(
      zip.body,
    )
    expect(
      await fetchJustificante(
        scriptedClient(htmlResponse('u', '<p/>')),
        receipt,
      ),
    ).toBeUndefined()
  })
  it('sends nothing when the page has no download button', async () => {
    const client = scriptedClient()
    expect(
      await fetchJustificante(client, htmlResponse('u', '<p/>')),
    ).toBeUndefined()
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
