import { beforeEach, describe, expect, it, vi } from 'vitest'

import { loginWithCertificate } from '../../carpeta/session/loginWithCertificate'
import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { carpetaCommands } from '../carpetaCommands'

vi.mock('../../carpeta/session/loginWithCertificate')

describe('carpeta demanda-empleo', () => {
  const command = carpetaCommands.find(
    (entry) => entry.action === 'demanda-empleo',
  )
  const url = 'https://carpetaciudadana.gob.es/api/empleo'

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
  })

  it('reads registration status and preserves the local date without returning benefits', async () => {
    const client = scriptedClient(
      htmlResponse(
        url,
        JSON.stringify({
          datosInscripcion: {
            codigoRespuesta: { codRespuesta: 0 },
            inscrito: 'S',
            fechaInscrito: '2026-06-01T00:00:00.000+02:00',
          },
          prestaciones: { unrelated: true },
        }),
      ),
    )
    expect(command?.effect).toBe('read')
    await expect(command?.run(client, {})).resolves.toEqual({
      registered: true,
      registeredSince: '2026-06-01',
    })
    expect(client.request.mock.calls).toEqual([
      [
        url,
        {
          method: 'GET',
          followRedirects: false,
          headers: { Accept: 'application/json', Authorization: 'cc' },
        },
      ],
    ])
  })

  it('uses the historical route for an explicit date and recognizes a negative response', async () => {
    const datedUrl = `${url}/fecha?fechaInscripcion=20261011`
    const client = scriptedClient(
      htmlResponse(
        datedUrl,
        JSON.stringify({
          datosInscripcion: {
            codigoRespuesta: { codRespuesta: '0' },
            inscrito: 'N',
          },
        }),
      ),
    )
    await expect(
      command?.run(client, { fecha: '11/10/2026' }),
    ).resolves.toEqual({
      registered: false,
      registeredSince: null,
    })
    expect(client.request.mock.calls[0]?.[0]).toBe(datedUrl)
  })

  it('rejects a provider warning without reporting that the holder is unregistered', async () => {
    const client = scriptedClient(
      htmlResponse(
        url,
        JSON.stringify({
          datosInscripcion: {
            codigoRespuesta: { codRespuesta: 1 },
            inscrito: 'N',
          },
        }),
      ),
    )
    await expect(command?.run(client, {})).rejects.toThrow(
      'did not confirm employment registration',
    )
  })

  it('rejects an invalid date before authentication', async () => {
    const client = scriptedClient()
    await expect(command?.run(client, { fecha: '30/02/2026' })).rejects.toThrow(
      '--fecha must be a dd/mm/aaaa date',
    )
    expect(loginWithCertificate).not.toHaveBeenCalled()
  })
})
