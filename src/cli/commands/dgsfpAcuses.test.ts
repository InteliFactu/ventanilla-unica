import { describe, expect, it } from 'vitest'

import { dgsfpDigestPage } from '../../dgsfp/fixtures/dgsfpDigestPage'
import { fakeDgsfpClient } from '../../dgsfp/fixtures/fakeDgsfpClient'
import { respondJson } from '../../dgsfp/fixtures/respondJson'
import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { respondWith } from '../../sta/registry/fixtures/respondWith'
import { commandRegistry } from '../commandRegistry'

describe('dgsfp acuses', () => {
  const command = commandRegistry.find(
    (entry) => entry.portal === 'dgsfp' && entry.action === 'acuses',
  )
  const identity = buildTestIdentity('IDCES-00000000T', '2.5.4.5')
  const receiptClient = (payload: unknown) =>
    fakeDgsfpClient([
      (url) => /\/(?:AcuseRecibo\.aspx|getAcusesRecibo)$/.test(url),
      (url) =>
        url.endsWith('AcuseRecibo.aspx')
          ? respondWith(url, dgsfpDigestPage)
          : respondJson(url, payload),
    ])

  it('lists only the exact requested registration without fetching documents', async () => {
    expect(command?.effect).toBe('read')
    const client = receiptClient([
      { numReg: 'REGAGE26e00000000001', anioReg: '2026', fecha: '2026-10-05' },
      { numReg: 'REGAGE26e00000000012', anioReg: '2026', fecha: '2026-10-06' },
    ])
    await expect(
      command?.run(client, { registro: 'regage26e00000000001' }, identity),
    ).resolves.toEqual([
      {
        registryNumber: 'REGAGE26e00000000001',
        registryYear: '2026',
        registeredAt: '2026-10-05',
      },
    ])
    expect(client.calls.at(-1)?.url).toMatch(
      /\/GdServices\.svc\/getAcusesRecibo$/,
    )
    expect(client.calls.some((call) => call.url.includes('getDocumento'))).toBe(
      false,
    )
  })

  it('refuses a malformed receipt row', async () => {
    const client = receiptClient([{ numReg: 'REGAGE26e00000000001' }])
    await expect(command?.run(client, {}, identity)).rejects.toThrow(
      'malformed receipt entry',
    )
  })

  it('stops before querying receipts if the certificate does not match the holder', async () => {
    const client = receiptClient([])
    const other = buildTestIdentity('IDCES-00000001R', '2.5.4.5')
    await expect(command?.run(client, {}, other)).rejects.toThrow(
      'does not match the certificate',
    )
    expect(client.calls.at(-1)?.url).toMatch(/\/getCurrentUser$/)
  })
})
