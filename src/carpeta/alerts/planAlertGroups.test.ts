import { beforeEach, describe, expect, it, vi } from 'vitest'

import { carpetaActivarAvisos } from '../../cli/commands/carpetaActivarAvisos'
import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { carpetaUrls } from '../session/carpetaUrls'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { planAlertGroups } from './planAlertGroups'

vi.mock('../session/loginWithCertificate')

const address = 'alerts@example.test'
const days = { first: 15, second: 1 }
const groups = [
  {
    nombreAgrupacion: 'Documents',
    nivelAgrupacion: '1',
    prefEnvioMail: false,
    prefPush: true,
    primerAviso: 0,
    segundoAviso: null,
  },
  {
    nombreAgrupacion: 'Appointments',
    nivelAgrupacion: 2,
    prefEnvioMail: true,
    prefPush: false,
    primerAviso: '30',
    segundoAviso: 7,
  },
]

const settings = {
  codigoRespuesta: { codRespuesta: 0 },
  prefEmail: address,
  prefEmailVerif: address,
  preferencias: groups,
}

const withSettings = (prefs: object): ReturnType<typeof scriptedClient> =>
  scriptedClient(
    htmlResponse(
      carpetaUrls.alertSettings,
      JSON.stringify({ preferenciasUsuario: prefs }),
    ),
  )

describe('carpeta alert planning', () => {
  beforeEach(() => {
    vi.mocked(loginWithCertificate).mockReset().mockResolvedValue('token')
  })

  it('preserves the email, push flags and unselected values with a single settings read', async () => {
    const client = withSettings(settings)
    await expect(
      carpetaActivarAvisos.run(client, {
        grupos: '1',
        'primer-aviso': '15',
        'segundo-aviso': '1',
      }),
    ).resolves.toEqual({
      sent: false,
      body: {
        prefEmail: address,
        prefEmailVerif: address,
        prefAlertas: [
          {
            prefNivelAgrupacion: 1,
            primerAviso: 15,
            segundoAviso: 1,
            prefPush: true,
            prefEnvioMail: true,
          },
          {
            prefNivelAgrupacion: 2,
            primerAviso: 30,
            segundoAviso: 7,
            prefPush: false,
            prefEnvioMail: true,
          },
        ],
      },
    })
    expect(client.request.mock.calls).toEqual([
      [
        carpetaUrls.alertSettings,
        {
          headers: { Authorization: 'token', Accept: 'application/json' },
          followRedirects: false,
        },
      ],
    ])
  })

  it('refuses explicit confirmation before login or a settings request', async () => {
    const client = scriptedClient()
    await expect(
      carpetaActivarAvisos.run(client, { confirmar: 'si' }),
    ).rejects.toThrow('plan only')
    expect(loginWithCertificate).not.toHaveBeenCalled()
    expect(client.request.mock.calls).toHaveLength(0)
  })

  it('keeps explicit zero-day values on a group outside the plan', async () => {
    const client = withSettings(settings)
    const planned = await planAlertGroups(client, [2], days)
    expect(planned.body.prefAlertas[0]).toMatchObject({
      primerAviso: 0,
      segundoAviso: null,
    })
  })

  it.each([
    [[0], days, '--grupos'],
    [[1, 1], days, '--grupos'],
    [[1], { first: 1, second: 1 }, '--primer-aviso'],
    [[1], { first: 15, second: 15 }, '--segundo-aviso'],
  ] as const)(
    'rejects invalid choices before login',
    async (levels, notice, error) => {
      await expect(
        planAlertGroups(scriptedClient(), levels, notice),
      ).rejects.toThrow(error)
      expect(loginWithCertificate).not.toHaveBeenCalled()
    },
  )

  it.each([
    [
      { ...settings, codigoRespuesta: { codRespuesta: 1 } },
      'does not report success',
    ],
    [
      {
        ...settings,
        preferencias: [{ ...groups[0], prefPush: undefined }, groups[1]],
      },
      'settings are incomplete',
    ],
    [
      {
        ...settings,
        preferencias: [{ ...groups[0], nivelAgrupacion: 2 }, groups[1]],
      },
      'duplicate group levels',
    ],
    [{ ...settings, prefEmailVerif: null }, 'email is not verified'],
  ] as const)(
    'rejects an unusable calendar instead of guessing the remaining values',
    async (prefs, error) => {
      const client = withSettings(prefs)
      await expect(planAlertGroups(client, [1], days)).rejects.toThrow(error)
      expect(client.request.mock.calls).toHaveLength(1)
    },
  )

  it('refuses to plan a change for a group the portal does not list', async () => {
    await expect(
      planAlertGroups(withSettings(settings), [3], days),
    ).rejects.toThrow('no alert group has level 3')
  })
})
