import { describe, expect, it } from 'vitest'

import { carpetaAcceptPage } from '../fixtures/carpetaAcceptPage'
import { carpetaAnswer } from '../fixtures/carpetaAnswer'
import { fakeCarpetaClient } from '../fixtures/fakeCarpetaClient'
import { postCarpetaAcceptance } from './postCarpetaAcceptance'

const detail = carpetaAnswer(carpetaAcceptPage, 'firmarAcuseRecibo.jsf')

describe('postCarpetaAcceptance', () => {
  it('submits the panel button by A4J with every non-button field', async () => {
    const client = fakeCarpetaClient(
      carpetaAnswer('<span>El documento se ha firmado correctamente.</span>'),
    )
    await postCarpetaAcceptance(client, detail)
    expect(client.request).toHaveBeenCalledWith(detail.url, {
      timeoutMs: 180_000,
      method: 'POST',
      form: {
        form: 'form',
        'form:estado': 'Pendiente',
        'form:firma': '',
        'form:hash': 'JVBERi0=',
        'form:panelAceptar1OpenedState': '',
        'javax.faces.ViewState': 'state-2',
        AJAXREQUEST: '_viewRoot',
        'form:j_id7': 'form:j_id7',
      },
      referer: detail.url,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
  })

  it('treats any other answer as a failure', async () => {
    await expect(
      postCarpetaAcceptance(fakeCarpetaClient(carpetaAnswer('<p/>')), detail),
    ).rejects.toThrow('did not confirm the acceptance')
  })

  it('refuses a screen without the panel button, posting nothing', async () => {
    const client = fakeCarpetaClient()
    await expect(
      postCarpetaAcceptance(client, carpetaAnswer('<form></form>')),
    ).rejects.toThrow('no acceptance button')
    expect(client.request).not.toHaveBeenCalled()
  })
})
