import { describe, expect, it } from 'vitest'

import { carpetaAnswer } from '../fixtures/carpetaAnswer'
import { carpetaListPage } from '../fixtures/carpetaListPage'
import { carpetaRowsTable } from '../fixtures/carpetaRowsTable'
import { fakeCarpetaClient } from '../fixtures/fakeCarpetaClient'
import { findCarpetaNotification } from './findCarpetaNotification'

const search = carpetaAnswer(carpetaListPage([]))
const first = { number: 'NOT-1', status: 'Expirado', link: 'j_id20' }
const second = { number: 'NOT-2', status: 'Pendiente', link: 'j_id20' }

describe('findCarpetaNotification', () => {
  it('finds a row on the first page and searches every state', async () => {
    const client = fakeCarpetaClient(
      search,
      carpetaAnswer(carpetaListPage([first, second])),
    )
    const located = await findCarpetaNotification(client, 'NOT-2')
    expect(located.record['status']).toBe('Pendiente')
    expect({ ...located, record: {} }).toEqual({
      record: {},
      link: 'f:tablaNotificaciones:1:j_id20',
      form: {
        action: search.url,
        fields: { f: 'f', 'javax.faces.ViewState': 'state-1' },
      },
      referer: search.url,
    })
    expect(client.request.mock.calls[1]?.[1]?.form).toMatchObject({
      'f:estado': '',
    })
  })

  it('pages the scroller and posts with the ViewState of the page that showed the row', async () => {
    const client = fakeCarpetaClient(
      search,
      carpetaAnswer(carpetaListPage([first], { scroller: true })),
      carpetaAnswer(
        `${carpetaRowsTable([second], 1)}<input type="hidden" name="javax.faces.ViewState" value="state-9" />`,
      ),
    )
    const located = await findCarpetaNotification(client, 'NOT-2')
    expect(located.form.fields['javax.faces.ViewState']).toBe('state-9')
    expect(client.request.mock.calls[2]?.[1]?.form).toMatchObject({
      'f:paginas': '2',
    })
  })

  it('stops when a page repeats and reports the number missing', async () => {
    const page = carpetaAnswer(carpetaListPage([first], { scroller: true }))
    const client = fakeCarpetaClient(search, page, page)
    await expect(findCarpetaNotification(client, 'NOT-3')).rejects.toThrow(
      'NOT-3 is not in the Carpeta Ciudadana',
    )
    expect(client.request).toHaveBeenCalledTimes(3)
  })

  it('refuses a row without a link and a page without the grid', async () => {
    await expect(
      findCarpetaNotification(
        fakeCarpetaClient(
          search,
          carpetaAnswer(
            carpetaListPage([{ number: 'X', status: 'Pendiente' }]),
          ),
        ),
        'X',
      ),
    ).rejects.toThrow('no link')
    await expect(
      findCarpetaNotification(
        fakeCarpetaClient(search, carpetaAnswer('<p/>')),
        'X',
      ),
    ).rejects.toThrow('no result grid')
  })
})
