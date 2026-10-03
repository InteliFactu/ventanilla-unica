import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { aeatCertificadoCorriente } from './aeatCertificadoCorriente'

vi.mock('../../aeat/compliance/emitComplianceCertificate', () => ({
  emitComplianceCertificate: vi.fn(
    async (_client: unknown, request: unknown, outDir: unknown) =>
      Promise.resolve({ request, outDir }),
  ),
}))

const client: HttpClient = { request: vi.fn(), cookie: () => undefined }

describe('aeatCertificadoCorriente', () => {
  it('is an emission, not a write', () => {
    expect(aeatCertificadoCorriente.effect).toBe('emit')
  })

  it('requires --nif', async () => {
    await expect(aeatCertificadoCorriente.run(client, {})).rejects.toThrow(
      /--nif is required/,
    )
  })

  it('rejects an unknown --finalidad', async () => {
    await expect(
      aeatCertificadoCorriente.run(client, {
        nif: 'B00000000',
        finalidad: 'transporte',
      }),
    ).rejects.toThrow(/--finalidad must be one of/)
  })

  it('defaults to contratacion and passes --out through', async () => {
    const result = (await aeatCertificadoCorriente.run(client, {
      nif: 'B00000000',
      out: '/tmp/x',
    })) as { request: { nif: string; purpose: string }; outDir: string }

    expect(result.request).toEqual({
      nif: 'B00000000',
      purpose: 'contratacion',
    })
    expect(result.outDir).toBe('/tmp/x')
  })
})
