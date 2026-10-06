import { describe, expect, it } from 'vitest'

import { carpetaAnswer } from '../fixtures/carpetaAnswer'
import { carpetaListPage } from '../fixtures/carpetaListPage'
import { fakeCarpetaClient } from '../fixtures/fakeCarpetaClient'
import { fetchCarpetaPdf } from './fetchCarpetaPdf'

const page = carpetaAnswer(carpetaListPage([], { panel: true }))

describe('fetchCarpetaPdf', () => {
  it('presses the panel button and returns the PDF', async () => {
    const client = fakeCarpetaClient(carpetaAnswer(Buffer.from('%PDF-1.7')))
    const pdf = await fetchCarpetaPdf(client, page, 'imprimirnot')
    expect(pdf?.toString()).toBe('%PDF-1.7')
    expect(client.request.mock.calls[0]?.[1]?.form).toEqual({
      f: 'f',
      'javax.faces.ViewState': 'state-1',
      'f:imprimirnot.x': '10',
      'f:imprimirnot.y': '10',
    })
  })

  it('answers undefined for an HTML answer or a missing button', async () => {
    expect(
      await fetchCarpetaPdf(
        fakeCarpetaClient(carpetaAnswer('<html/>')),
        page,
        'imprimiracuse',
      ),
    ).toBeUndefined()
    expect(
      await fetchCarpetaPdf(fakeCarpetaClient(), carpetaAnswer('<p/>'), 'x'),
    ).toBeUndefined()
  })
})
