import { readFile } from 'node:fs/promises'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { youthGuaranteeContactAnswers } from '../../sepe/youthGuarantee/fixtures/youthGuaranteeContactAnswers'
import { youthGuaranteeContactPage } from '../../sepe/youthGuarantee/fixtures/youthGuaranteeContactPage'
import { youthGuaranteePage } from '../../sepe/youthGuarantee/fixtures/youthGuaranteePage'
import { youthGuaranteeReadResponses } from '../../sepe/youthGuarantee/fixtures/youthGuaranteeReadResponses'
import { youthGuaranteeUrls } from '../../sepe/youthGuarantee/youthGuaranteeUrls'
import { sepeGarantiaJuvenil } from './sepeGarantiaJuvenil'

vi.mock('node:fs/promises', () => ({ readFile: vi.fn() }))

describe('inscription with municipality and contact verification', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetAllMocks()
  })
  it.each([undefined, 'no', 'SI'])(
    'plans with municipality names and verification paths without writes when confirmation is %s',
    async (confirmation) => {
      const responses = youthGuaranteeReadResponses()
      responses[6] = htmlResponse(
        youthGuaranteeUrls.page(2),
        youthGuaranteeContactPage(),
      )
      const client = scriptedClient(...responses)
      const result = await sepeGarantiaJuvenil.run(client, {
        inscribir: 'si',
        confirmar: confirmation,
        respuestas: JSON.stringify(youthGuaranteeContactAnswers),
        'pin-fichero': '/synthetic/pin',
        'enlace-fichero': '/synthetic/link',
      })
      expect(result).toMatchObject({ executed: false })
      expect(
        client.request.mock.calls
          .slice(4)
          .every(
            ([, options]) =>
              options?.method === undefined && options?.form === undefined,
          ),
      ).toBe(true)
      expect(readFile).not.toHaveBeenCalled()
    },
  )
  it('completes six steps after both verification checks and uses refreshed tokens', async () => {
    const responses = youthGuaranteeReadResponses()
    responses[6] = htmlResponse(
      youthGuaranteeUrls.page(2),
      youthGuaranteeContactPage(),
    )
    const client = scriptedClient(
      ...responses,
      htmlResponse(youthGuaranteeUrls.page(1), youthGuaranteePage(1)),
      htmlResponse(youthGuaranteeUrls.page(2), youthGuaranteeContactPage()),
      htmlResponse(
        'https://garantiajuvenil.sepe.es/cargarMunicipios.action',
        '{"listadoMunicipios":[{"denominacionC":"Cáceres","idMunicipioC":"10037"}]}',
      ),
      htmlResponse(
        youthGuaranteeUrls.page(2),
        youthGuaranteeContactPage('0', '0', 'after-sms'),
      ),
      htmlResponse(
        youthGuaranteeUrls.page(2),
        youthGuaranteeContactPage('1', '0', 'after-otp'),
      ),
      htmlResponse(
        youthGuaranteeUrls.page(2),
        youthGuaranteeContactPage('1', '2', 'after-email'),
      ),
      htmlResponse(
        'https://garantiajuvenil.sepe.es/verify?token=synthetic',
        'Confirmed',
      ),
      htmlResponse(
        youthGuaranteeUrls.page(2),
        youthGuaranteeContactPage('1', '1', 'after-link'),
      ),
      ...Array.from({ length: 4 }, (_, index) =>
        htmlResponse(
          youthGuaranteeUrls.page(index + 3),
          youthGuaranteePage(index + 3),
        ),
      ),
      htmlResponse(
        youthGuaranteeUrls.page(6),
        '<a href="./logout">Salir</a><h1>Solicitud registrada correctamente</h1><p>Número de registro: TEST-2026-0002</p>',
      ),
    )
    vi.mocked(readFile)
      .mockResolvedValueOnce('123456')
      .mockResolvedValueOnce(
        'https://garantiajuvenil.sepe.es/verify?token=synthetic',
      )
    vi.spyOn(process.stderr, 'write').mockReturnValue(true)
    const result = await sepeGarantiaJuvenil.run(client, {
      inscribir: 'si',
      confirmar: 'si',
      respuestas: JSON.stringify(youthGuaranteeContactAnswers),
      'pin-fichero': '/synthetic/pin',
      'enlace-fichero': '/synthetic/link',
    })
    expect(result).toMatchObject({
      executed: true,
      receipt: { registered: true, registrationNumber: 'TEST-2026-0002' },
    })
    const steps = client.request.mock.calls.filter(([url]) =>
      /Token\.action/.test(url),
    )
    expect(steps).toHaveLength(9)
    expect(steps[4]?.[1]?.form).toMatchObject({
      validar: 'Siguiente',
      token: 'after-link',
      confirmaMovil: '1',
      'datosDireccionDomicilio.tcodMunicipio': '10037',
    })
    expect(steps[8]?.[1]?.form).toMatchObject({
      confirmarInscripcion: 'Confirmar solicitud',
    })
  })
  it('refuses a supplied PIN answer even in plan mode', async () => {
    const responses = youthGuaranteeReadResponses()
    responses[6] = htmlResponse(
      youthGuaranteeUrls.page(2),
      youthGuaranteeContactPage(),
    )
    const client = scriptedClient(...responses)
    await expect(
      sepeGarantiaJuvenil.run(client, {
        inscribir: 'si',
        respuestas: JSON.stringify({ '2': { pinSMS: '123456' } }),
      }),
    ).rejects.toThrow(/not an offered editable control/)
    expect(
      client.request.mock.calls
        .slice(4)
        .every(([, options]) => options?.method === undefined),
    ).toBe(true)
  })
})
