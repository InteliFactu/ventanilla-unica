import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { youthGuaranteeAnswers } from '../../sepe/youthGuarantee/fixtures/youthGuaranteeAnswers'
import { youthGuaranteePage } from '../../sepe/youthGuarantee/fixtures/youthGuaranteePage'
import { youthGuaranteeReadResponses } from '../../sepe/youthGuarantee/fixtures/youthGuaranteeReadResponses'
import { youthGuaranteeUrls } from '../../sepe/youthGuarantee/youthGuaranteeUrls'
import { sepeGarantiaJuvenil } from './sepeGarantiaJuvenil'

describe('sepe garantia-juvenil command', () => {
  it('registers the read-first command and its explicit write options', () => {
    expect(sepeGarantiaJuvenil).toMatchObject({
      portal: 'sepe',
      action: 'garantia-juvenil',
      effect: 'write',
      options: [
        'inscribir',
        'respuestas',
        'pin-fichero',
        'enlace-fichero',
        'sms',
        'correo',
      ],
    })
  })
  it('reads without an inscription flag', async () => {
    expect(
      await sepeGarantiaJuvenil.run(
        scriptedClient(...youthGuaranteeReadResponses()),
        {},
      ),
    ).toMatchObject({ inscribed: false })
  })
  it.each([undefined, 'no', 'SI', 'yes'])(
    'plans without saving or validating when confirmation is %s',
    async (confirmation) => {
      const client = scriptedClient(...youthGuaranteeReadResponses())
      const result = await sepeGarantiaJuvenil.run(client, {
        inscribir: 'si',
        confirmar: confirmation,
        respuestas: JSON.stringify(youthGuaranteeAnswers),
      })
      expect(result).toMatchObject({
        executed: false,
        current: { inscribed: false },
      })
      expect(
        client.request.mock.calls.filter(([url]) => /Token\.action/.test(url)),
      ).toEqual([])
    },
  )
  it.each([
    { confirmar: 'si' },
    { respuestas: '{}' },
    { inscribir: 'yes' },
    { sms: 'solicitar' },
    { correo: 'reutilizar' },
  ])(
    'rejects an incomplete or misspelled action before login',
    async (options) => {
      const client = scriptedClient()
      await expect(sepeGarantiaJuvenil.run(client, options)).rejects.toThrow(
        /--inscribir/,
      )
      expect(client.request.mock.calls).toHaveLength(0)
    },
  )
  it.each([
    ['sms', 'si'],
    ['correo', 'reenviar'],
  ])('rejects --%s %s before login', async (flag, value) => {
    const client = scriptedClient()
    await expect(
      sepeGarantiaJuvenil.run(client, {
        inscribir: 'si',
        respuestas: '{}',
        [flag]: value,
      }),
    ).rejects.toThrow(`--${flag} accepts only solicitar or reutilizar`)
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('rejects token overrides without a single inscription write', async () => {
    const client = scriptedClient(...youthGuaranteeReadResponses())
    await expect(
      sepeGarantiaJuvenil.run(client, {
        inscribir: 'si',
        respuestas: '{"1":{"token":"override"}}',
      }),
    ).rejects.toThrow(/not an offered editable control/)
    expect(
      client.request.mock.calls.filter(([url]) => /Token\.action/.test(url)),
    ).toEqual([])
  })
  it('refuses confirmation with undeclared legal commitments', async () => {
    const client = scriptedClient(...youthGuaranteeReadResponses())
    await expect(
      sepeGarantiaJuvenil.run(client, { inscribir: 'si', confirmar: 'si' }),
    ).rejects.toThrow(/declare all five/)
    expect(
      client.request.mock.calls.filter(([url]) => /Token\.action/.test(url)),
    ).toEqual([])
  })
  it('submits only after both action flags, using fresh tokens and declared answers', async () => {
    const responses = [
      ...youthGuaranteeReadResponses(),
      htmlResponse(youthGuaranteeUrls.page(1), youthGuaranteePage(1)),
      ...Array.from({ length: 5 }, (_, index) =>
        htmlResponse(
          youthGuaranteeUrls.page(index + 2),
          youthGuaranteePage(index + 2),
        ),
      ),
      htmlResponse(
        youthGuaranteeUrls.page(6),
        '<a href="./logout">Salir</a><h1>Solicitud registrada correctamente</h1><p>Número de registro: TEST-2026-0001</p>',
      ),
    ]
    const client = scriptedClient(...responses)
    const result = await sepeGarantiaJuvenil.run(client, {
      inscribir: 'si',
      confirmar: 'si',
      'pin-fichero': '/synthetic/pin',
      'enlace-fichero': '/synthetic/link',
      respuestas: JSON.stringify(youthGuaranteeAnswers),
    })
    expect(result).toMatchObject({
      executed: true,
      receipt: { registered: true, registrationNumber: 'TEST-2026-0001' },
    })
    const submissions = client.request.mock.calls.filter(([url]) =>
      /Token\.action/.test(url),
    )
    expect(submissions).toHaveLength(6)
    expect(submissions[1]?.[1]).toMatchObject({
      form: { token: 'synthetic-2', choice: 'A', siguiente: 'Siguiente' },
    })
    expect(submissions[5]?.[1]?.form).not.toHaveProperty('limpiar')
  })
  it('never submits for an already registered holder', async () => {
    const client = scriptedClient(
      ...youthGuaranteeReadResponses(
        '<a href="./logout">Salir</a><p>Estado: alta</p>',
      ).slice(0, 4),
    )
    await expect(
      sepeGarantiaJuvenil.run(client, {
        inscribir: 'si',
        confirmar: 'si',
        'pin-fichero': '/synthetic/pin',
        'enlace-fichero': '/synthetic/link',
        respuestas: JSON.stringify(youthGuaranteeAnswers),
      }),
    ).rejects.toThrow(/explicitly unregistered/)
    expect(
      client.request.mock.calls.filter(([url]) => /Token\.action/.test(url)),
    ).toEqual([])
  })

  it('preserves the completed action and registry number when its PDF download fails', async () => {
    const url = 'https://garantiajuvenil.sepe.es/certificado.pdf'
    const client = scriptedClient(
      ...youthGuaranteeReadResponses(),
      htmlResponse(youthGuaranteeUrls.page(1), youthGuaranteePage(1)),
      ...Array.from({ length: 5 }, (_, index) =>
        htmlResponse(
          youthGuaranteeUrls.page(index + 2),
          youthGuaranteePage(index + 2),
        ),
      ),
      htmlResponse(
        youthGuaranteeUrls.page(6),
        `<a href="./logout">Salir</a><h1>Solicitud registrada correctamente</h1><p>Número de registro: TEST-2026-0001</p><a href="${url}">Certificado</a>`,
      ),
      { ...htmlResponse(url, 'Unavailable'), status: 503 },
    )
    const result = await sepeGarantiaJuvenil.run(client, {
      inscribir: 'si',
      confirmar: 'si',
      'pin-fichero': '/synthetic/pin',
      'enlace-fichero': '/synthetic/link',
      respuestas: JSON.stringify(youthGuaranteeAnswers),
      out: '/unused',
    })
    expect(result).toMatchObject({
      executed: true,
      receipt: { registered: true, registrationNumber: 'TEST-2026-0001' },
    })
    expect(JSON.stringify(result)).toContain('PDF download failed')
  })
})
