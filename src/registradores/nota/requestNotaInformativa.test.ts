import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { registradoresOrderPages } from '../fixtures/registradoresOrderPages'
import { registradoresPlanPages } from '../fixtures/registradoresPlanPages'
import { requestNotaInformativa } from './requestNotaInformativa'
import type { NotaQuery } from './types/NotaQuery'

const query: NotaQuery = {
  nif: 'B00000000',
  email: 'notas@example.com',
  telefono: '600000000',
  direccion: 'CALLE EJEMPLO 1',
  codigoPostal: '10001',
  segments: ['administradores'],
  irpfRetention: true,
}
const noSleep = async (): Promise<void> => {}

describe('requestNotaInformativa', () => {
  it('plans without posting the identification', async () => {
    const client = scriptedClient(...registradoresPlanPages())
    const result = await requestNotaInformativa(client, query, false, noSleep)
    expect(result.executed).toBe(false)
    expect(result.accountsDepositAvailable).toBe(false)
    expect(result.company).toMatchObject({
      name: 'EJEMPLO ACTIVIDADES SL',
      irus: '1000000000002',
      registry: 'CACERES',
    })
    expect(result.plan).toContain('  company.billingData.townCode=37')
    expect(result.plan).toContain(
      '  company.representanteData.personIdentificationData.documentNumber=00000000T',
    )
    const urls = client.request.mock.calls.map(([url]) => url)
    expect(urls.some((url) => url.includes('confirmar-identificacion'))).toBe(
      false,
    )
    for (const [, options] of client.request.mock.calls)
      expect(options?.headers?.['Connection']).toBe('close')
    expect(client.request.mock.calls[7]?.[1]?.form).toMatchObject({
      _csrf: 'csrf-1',
      selectedDocumentId: 'doc-1',
    })
  })

  it('orders, polls and writes the checkout page without paying', async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'nota-'))
    const client = scriptedClient(
      ...registradoresPlanPages(),
      ...registradoresOrderPages(),
    )
    const result = await requestNotaInformativa(
      client,
      { ...query, outDir },
      true,
      noSleep,
    )
    expect(result.receipt).toMatchObject({
      price: '3,58 €',
      checkoutUrl:
        'https://payment.example.com/hostedcheckout/Payment/Form/abc123',
    })
    const calls = client.request.mock.calls
    expect(calls[12]?.[1]?.form).toMatchObject({
      'company.billingData.address': 'CALLE EJEMPLO 1',
      irpfRetention: 'true',
    })
    expect(calls[13]?.[1]).toMatchObject({
      followRedirects: false,
      form: { paymentType: 'CARD' },
    })
    expect(calls.every(([url]) => !url.includes('payment.example.com'))).toBe(
      true,
    )
    // The path is the test's own temporary directory.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const page = await readFile(result.receipt?.checkoutPage ?? '', 'utf8')
    expect(page).toContain(
      'action="https://payment.example.com/hostedcheckout/Payment/Form/abc123"',
    )
  })

  it('refuses a pago-orden without a checkout form', async () => {
    const order = registradoresOrderPages().slice(0, 4)
    const client = scriptedClient(
      ...registradoresPlanPages(),
      ...order,
      htmlResponse('https://sede.registradores.org/site/x', '<p>error</p>'),
    )
    await expect(
      requestNotaInformativa(client, query, true, noSleep),
    ).rejects.toThrow('no checkout form')
  })
})
