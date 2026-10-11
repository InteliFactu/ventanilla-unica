import { describe, expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { confirmEmail } from './confirmEmail'
import { mapAlertSettings } from './mappers/mapAlertSettings'
import { readHashToken } from './parsers/readHashToken'
import { readOutcome } from './parsers/readOutcome'
import { readAlertSettings } from './readAlertSettings'
import { requestEmailVerification } from './requestEmailVerification'

vi.mock('../session/loginWithCertificate')

const address = 'ana@example.org'
const settings = {
  preferenciasUsuario: {
    prefEmail: address,
    prefEmailVerif: null,
    estadoPrefEmail: 'Pendiente de verificar',
    preferencias: [
      { nombreAgrupacion: 'Citas previas', prefEnvioMail: true },
      { nombreAgrupacion: 'Hitos', prefEnvioMail: false, prefPush: false },
    ],
  },
}

describe('carpeta alerts', () => {
  it('maps the alert settings', () => {
    expect(mapAlertSettings(settings)).toEqual({
      email: address,
      verifiedEmail: null,
      emailState: 'Pendiente de verificar',
      activeAlerts: ['Citas previas'],
    })
    expect(() => mapAlertSettings({})).toThrow('no preferenciasUsuario')
  })

  it('reads both outcome envelopes and rejects non-JSON', () => {
    expect(
      readOutcome(
        '{"verificacionEmail":{"codigoRespuesta":{"codRespuesta":0},"mensaje":"m"}}',
        'verificacionEmail',
      ),
    ).toEqual({ ok: true, message: 'm' })
    expect(
      readOutcome(
        '{"confirmacionEmail":{"codigoRespuesta":{"codRespuesta":2,"textoRespuesta":"t"}}}',
        'confirmacionEmail',
      ),
    ).toEqual({ ok: false, message: 't' })
    expect(() => readOutcome('<html>', 'x')).toThrow('was not JSON')
  })

  it('takes the hashToken from a link or as given', () => {
    expect(
      readHashToken(
        'https://carpetaciudadana.gob.es/verificarCorreo?hashToken=h1',
      ),
    ).toBe('h1')
    expect(readHashToken('h2')).toBe('h2')
    expect(() =>
      readHashToken('https://carpetaciudadana.gob.es/verificarCorreo'),
    ).toThrow('no hashToken')
  })

  it('reads the settings after logging in', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const client = scriptedClient(
      htmlResponse(
        'https://carpetaciudadana.gob.es/a',
        JSON.stringify(settings),
      ),
    )
    await expect(readAlertSettings(client)).resolves.toMatchObject({
      email: address,
    })
    const failing = scriptedClient({
      ...htmlResponse('https://carpetaciudadana.gob.es/a', ''),
      status: 401,
    })
    await expect(readAlertSettings(failing)).rejects.toThrow('HTTP 401')
  })

  it('sends nothing without confirmation and validates the address', async () => {
    const client = scriptedClient()
    await expect(
      requestEmailVerification(client, address, false),
    ).resolves.toEqual({ email: address, requested: false })
    expect(client.request.mock.calls).toHaveLength(0)
    expect(loginWithCertificate).not.toHaveBeenCalled()
    await expect(
      requestEmailVerification(client, 'nope', true),
    ).rejects.toThrow('not an email address')
  })

  it('asks the Carpeta to verify the address when confirmed', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const client = scriptedClient(
      htmlResponse(
        'https://carpetaciudadana.gob.es/v',
        '{"verificacionEmail":{"codigoRespuesta":{"codRespuesta":0},"mensaje":"enviado"}}',
      ),
    )
    await expect(
      requestEmailVerification(client, address, true),
    ).resolves.toEqual({
      email: address,
      requested: true,
      ok: true,
      message: 'enviado',
    })
  })

  it('confirms the link only when confirmed', async () => {
    const idle = scriptedClient()
    await expect(confirmEmail(idle, 'h', false)).resolves.toEqual({
      confirmed: false,
    })
    expect(idle.request.mock.calls).toHaveLength(0)
    const client = scriptedClient(
      htmlResponse(
        'https://carpetaciudadana.gob.es/c',
        '{"confirmacionEmail":{"codigoRespuesta":{"codRespuesta":0},"mensaje":"ok"}}',
      ),
    )
    await expect(confirmEmail(client, 'h', true)).resolves.toEqual({
      confirmed: true,
      ok: true,
      message: 'ok',
    })
  })
})
