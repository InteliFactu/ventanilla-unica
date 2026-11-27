import { describe, expect, it } from 'vitest'

import { fakeDgsfpClient } from '../../dgsfp/fixtures/fakeDgsfpClient'
import { respondJson } from '../../dgsfp/fixtures/respondJson'
import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { respondWith } from '../../sta/registry/fixtures/respondWith'
import { commandRegistry } from '../commandRegistry'

describe('dgsfp borrador', () => {
  const command = commandRegistry.find(
    (entry) => entry.portal === 'dgsfp' && entry.action === 'borrador',
  )
  const identity = buildTestIdentity('IDCES-00000000T', '2.5.4.5')
  const draftRoute = '/recuperarBorradorPresentacion?b=TEL43'
  const draftClient = (payload: unknown) =>
    fakeDgsfpClient([
      (url) => url.endsWith(draftRoute),
      (url, options) => {
        expect(options).toMatchObject({
          method: 'GET',
          followRedirects: false,
        })
        return respondJson(url, payload)
      },
    ])

  it('reads the explicit empty TEL43 draft result without editing it', async () => {
    const client = draftClient('')

    expect(command?.effect).toBe('read')
    await expect(command?.run(client, {}, identity)).resolves.toEqual({
      hasDraft: false,
    })
    expect(client.calls.at(-1)?.url).toContain(draftRoute)
    expect(
      client.calls.filter((call) =>
        /\/(?:guardar|eliminar)BorradorPresentacion/i.test(call.url),
      ),
    ).toEqual([])
  })

  it('reports a saved draft without returning any form data', async () => {
    const client = draftClient(
      JSON.stringify({
        tituloFormulario: 'Presentación de quejas y reclamaciones',
        secciones: [{ nombre: 'Reclamación', lineasSeccion: [] }],
      }),
    )

    await expect(command?.run(client, {}, identity)).resolves.toEqual({
      hasDraft: true,
    })
  })

  it.each([null, {}, '{}', 'unexpected markup'])(
    'refuses an unrecognized draft reply %j',
    async (payload) => {
      await expect(
        command?.run(draftClient(payload), {}, identity),
      ).rejects.toThrow('unexpected complaint draft response')
    },
  )

  it('rejects a lookup redirect without using its body', async () => {
    const client = fakeDgsfpClient([
      (url) => url.endsWith(draftRoute),
      (url) => ({
        ...respondWith(url, '""', 302),
        headers: { location: '/es/Auth/Paginas/inicio.aspx' },
      }),
    ])

    await expect(command?.run(client, {}, identity)).rejects.toThrow('HTTP 302')
  })

  it('checks the certificate holder before requesting the draft', async () => {
    const client = draftClient('')
    const other = buildTestIdentity('IDCES-00000001R', '2.5.4.5')

    await expect(command?.run(client, {}, other)).rejects.toThrow(
      'does not match the certificate',
    )
    expect(client.calls.at(-1)?.url).toMatch(/\/getCurrentUser$/)
  })

  it('refuses changed procedure metadata before the draft lookup', async () => {
    const client = fakeDgsfpClient([
      (url) => url.includes('obtenerFormularioProcedimiento'),
      (url) => respondJson(url, { numTelematico: 'TEL44' }),
    ])

    await expect(command?.run(client, {}, identity)).rejects.toThrow(
      'expected the TEL43 complaint procedure',
    )
    expect(client.calls.at(-1)?.url).toContain('obtenerFormularioProcedimiento')
  })

  it('requires the draft procedure metadata from the exact endpoint', async () => {
    const client = fakeDgsfpClient([
      (url) => url.includes('obtenerFormularioProcedimiento'),
      (url, options) => {
        expect(options).toMatchObject({
          method: 'GET',
          followRedirects: false,
        })
        return respondJson(new URL('/other', url).href, {
          numTelematico: 'TEL43',
        })
      },
    ])

    await expect(command?.run(client, {}, identity)).rejects.toThrow(
      'authenticated read left the requested endpoint',
    )
    expect(client.calls.at(-1)?.url).toContain('obtenerFormularioProcedimiento')
  })
})
