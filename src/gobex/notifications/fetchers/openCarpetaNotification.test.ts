import { describe, expect, it } from 'vitest'

import { carpetaAnswer } from '../fixtures/carpetaAnswer'
import { fakeCarpetaClient } from '../fixtures/fakeCarpetaClient'
import { openCarpetaNotification } from './openCarpetaNotification'

describe('openCarpetaNotification', () => {
  it('posts the list form with the link parameter', async () => {
    const client = fakeCarpetaClient(carpetaAnswer('<p/>'))
    await openCarpetaNotification(client, {
      record: {},
      link: 'f:t:0:j_id2',
      form: { action: 'https://sede.gobex.es/a.jsf', fields: { f: 'f' } },
      referer: 'https://sede.gobex.es/r.jsf',
    })
    expect(client.request).toHaveBeenCalledWith('https://sede.gobex.es/a.jsf', {
      timeoutMs: 180_000,
      method: 'POST',
      form: { f: 'f', 'f:t:0:j_id2': 'f:t:0:j_id2' },
      referer: 'https://sede.gobex.es/r.jsf',
    })
  })
})
