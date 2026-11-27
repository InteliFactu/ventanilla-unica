import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { filingReceiptHtml } from '../fixtures/filingReceiptHtml'
import { roleceReceiptZip } from '../fixtures/roleceReceiptZip'
import { fetchJustificante } from './fetchJustificante'

const receipt = htmlResponse(
  'https://registrodelicitadores.gob.es/rolece/comun/x',
  filingReceiptHtml,
)
const action =
  'https://registrodelicitadores.gob.es/rolece/comun/descargarJustificante.action'

describe('fetchJustificante', () => {
  it('answers the ZIP, or undefined for anything else', async () => {
    const archive = { ...htmlResponse(action, ''), body: roleceReceiptZip }
    const client = scriptedClient(archive)
    await expect(fetchJustificante(client, receipt)).resolves.toEqual(
      roleceReceiptZip,
    )
    expect(client.request.mock.calls[0]).toEqual([
      action,
      expect.objectContaining({ method: 'POST', followRedirects: false }),
    ])
    expect(
      await fetchJustificante(
        scriptedClient(htmlResponse(action, '<p/>')),
        receipt,
      ),
    ).toBeUndefined()
  })

  it('sends nothing if the receipt form targets a different action', async () => {
    const client = scriptedClient()
    const changed = htmlResponse(
      receipt.url,
      filingReceiptHtml.replace(
        /descargarJustificante\.action/u,
        'otraAccion.action',
      ),
    )

    await expect(fetchJustificante(client, changed)).resolves.toBeUndefined()
    expect(client.request.mock.calls).toHaveLength(0)
  })

  it('does not forward the signed receipt form from a different portal', async () => {
    const client = scriptedClient()
    const changed = htmlResponse(
      'https://sede.agenciatributaria.gob.es/',
      filingReceiptHtml.replace(
        '/rolece/comun/descargarJustificante.action',
        action,
      ),
    )

    await expect(fetchJustificante(client, changed)).resolves.toBeUndefined()
    expect(client.request.mock.calls).toHaveLength(0)
  })

  it('does not submit a receipt form from an unsuccessful response', async () => {
    const client = scriptedClient()

    await expect(
      fetchJustificante(client, { ...receipt, status: 500 }),
    ).resolves.toBeUndefined()
    expect(client.request.mock.calls).toHaveLength(0)
  })

  it.each([
    { status: 500, url: action, body: roleceReceiptZip },
    { status: 302, url: action, body: roleceReceiptZip },
    { status: 200, url: receipt.url, body: roleceReceiptZip },
    { status: 200, url: action, body: roleceReceiptZip.subarray(0, 4) },
    { status: 200, url: action, body: roleceReceiptZip.subarray(0, -2) },
  ])(
    'rejects a failed, redirected or incomplete archive response %#',
    async (response) => {
      const client = scriptedClient({
        ...htmlResponse(action, ''),
        ...response,
      })
      await expect(fetchJustificante(client, receipt)).resolves.toBeUndefined()
    },
  )

  it('sends nothing when the page has no download button', async () => {
    const client = scriptedClient()
    expect(
      await fetchJustificante(client, htmlResponse('u', '<p/>')),
    ).toBeUndefined()
    expect(client.request.mock.calls).toHaveLength(0)
  })
})
