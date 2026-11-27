import { describe, expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { buildRegistryRequestBody } from './builders/buildRegistryRequestBody'
import { registryEntryFixture } from './fixtures/registryEntryFixture'
import { registryResponseFixture } from './fixtures/registryResponseFixture'
import { listRegistryEntries } from './listRegistryEntries'

vi.mock('../session/loginWithCertificate')

const url = 'https://carpetaciudadana.gob.es/api/consultaRegistros?lang=es'
const query = {
  from: new Date('2026-10-01T00:00:00.000Z'),
  to: new Date('2026-10-31T00:00:00.000Z'),
}

describe('carpeta registries', () => {
  it('builds the body the front posts', () => {
    expect(JSON.parse(buildRegistryRequestBody(query, 21, 20))).toEqual({
      criterios: {
        fechaInicial: '2026-10-01T00:00:00.000Z',
        fechaFinal: '2026-10-31T00:00:00.000Z',
        tipoTraza: '1',
        historico: '1',
      },
      paginacion: { posicionInicial: 21, numResultados: 20 },
    })
    expect(
      buildRegistryRequestBody(
        { ...query, number: 'REGAGE26e00000000001' },
        1,
        20,
      ),
    ).toContain('"numRegistro":"REGAGE26e00000000001"')
  })

  it('logs in and pages until the reported total', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const first = Array.from({ length: 20 }, (_, index) =>
      registryEntryFixture(`REGAGE26e${String(index).padStart(11, '0')}`),
    )
    const client = scriptedClient(
      htmlResponse(url, registryResponseFixture(first, 21)),
      htmlResponse(
        url,
        registryResponseFixture(
          [registryEntryFixture('REGAGE26e99999999999')],
          21,
        ),
      ),
    )
    const listing = await listRegistryEntries(client, query)
    expect(listing.total).toBe(21)
    expect(listing.entries).toHaveLength(21)
    expect(client.request.mock.calls).toHaveLength(2)
    const [calledUrl, options] = client.request.mock.calls[1] ?? []
    expect(calledUrl).toBe(url)
    expect(options).toMatchObject({
      method: 'POST',
      followRedirects: false,
      headers: { Authorization: 'cc', 'Content-Type': 'application/json' },
    })
    expect(String(options?.body)).toContain(
      '"paginacion":{"posicionInicial":21,"numResultados":20}',
    )
  })

  it('keeps a warning that only a later page carries', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const first = Array.from({ length: 20 }, (_, index) =>
      registryEntryFixture(`REGAGE26e${String(index).padStart(11, '0')}`),
    )
    const client = scriptedClient(
      htmlResponse(url, registryResponseFixture(first, 21)),
      htmlResponse(
        url,
        registryResponseFixture(
          [registryEntryFixture('REGAGE26e99999999999')],
          21,
          1,
          'Aviso tardío',
        ),
      ),
    )
    const listing = await listRegistryEntries(client, query)
    expect(listing.entries).toHaveLength(21)
    expect(listing.warnings).toEqual(['Aviso tardío'])
  })

  it('refuses a prematurely empty page', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const short = scriptedClient(
      htmlResponse(
        url,
        registryResponseFixture([registryEntryFixture('R1')], 5),
      ),
      htmlResponse(url, registryResponseFixture([], 5)),
    )
    await expect(listRegistryEntries(short, query)).rejects.toThrow(
      'incomplete result set',
    )
  })

  it('refuses an inconsistent total across pages', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const inconsistent = scriptedClient(
      htmlResponse(
        url,
        registryResponseFixture([registryEntryFixture('R1')], 2),
      ),
      htmlResponse(
        url,
        registryResponseFixture([registryEntryFixture('R2')], 3),
      ),
    )
    await expect(listRegistryEntries(inconsistent, query)).rejects.toThrow(
      'inconsistent result total',
    )
  })

  it('refuses a repeated entry even when the declared total would be reached', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const entry = registryEntryFixture('R1')
    const first = htmlResponse(url, registryResponseFixture([entry], 2))
    const second = htmlResponse(
      url,
      registryResponseFixture(
        [{ ...entry, fechaRegistro: '2026-10-06T15:14:22.000+0000' }],
        2,
      ),
    )
    const repeated = scriptedClient(first, second)
    await expect(listRegistryEntries(repeated, query)).rejects.toThrow(
      'repeated a registry entry',
    )
  })

  it('refuses more entries than the API declared', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const overcount = scriptedClient(
      htmlResponse(
        url,
        registryResponseFixture([registryEntryFixture('R1')], 0),
      ),
    )
    await expect(listRegistryEntries(overcount, query)).rejects.toThrow(
      'inconsistent result total',
    )
  })

  it('refuses a result for a different registry number', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const mismatched = scriptedClient(
      htmlResponse(
        url,
        registryResponseFixture([registryEntryFixture('R1')], 1),
      ),
    )
    await expect(
      listRegistryEntries(mismatched, { ...query, number: 'R2' }),
    ).rejects.toThrow('different registry number')
  })

  it('returns a case-insensitive exact match for a REGAGE lookup', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const number = 'REGAGE26e00000000001'
    const match = scriptedClient(
      htmlResponse(
        url,
        registryResponseFixture([registryEntryFixture(number)], 1),
      ),
    )
    const result = await listRegistryEntries(match, {
      ...query,
      number: number.toUpperCase(),
    })
    expect(result).toMatchObject({
      total: 1,
      entries: [{ number }],
      warnings: [],
    })
  })

  it('fails on an HTTP error', async () => {
    vi.mocked(loginWithCertificate).mockResolvedValue('cc')
    const failing = scriptedClient({ ...htmlResponse(url, ''), status: 401 })
    await expect(listRegistryEntries(failing, query)).rejects.toThrow(
      'HTTP 401',
    )
  })
})
