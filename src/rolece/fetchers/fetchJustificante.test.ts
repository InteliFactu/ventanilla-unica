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
  it('answers the PDF, or undefined for anything else', async () => {
    const pdf = { ...htmlResponse('u', ''), body: Buffer.from('%PDF-1.7') }
    expect(await fetchJustificante(scriptedClient(pdf), receipt)).toEqual(
      pdf.body,
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
