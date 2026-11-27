import { expect, it, vi } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpClient } from '../../http/types/HttpClient'
import { emitUpToDateCertificate } from './emitUpToDateCertificate'

const pastLeapDay = '29/02/2024'

it.each([
  ['sin-deuda-fecha', '4', { fechaNegativo: pastLeapDay }],
  [
    'licitacion-fecha',
    '8',
    {
      fechaLicitacionSinDeuda: pastLeapDay,
      nifLicitacionSinDeuda: 'S2817035E',
    },
  ],
  ['subvenciones-fecha', '9', { fechaSubvencionSinDeuda: pastLeapDay }],
] as const)('sends the portal fields for %s', async (kind, code, expected) => {
  const request = vi
    .fn<HttpClient['request']>()
    .mockResolvedValue(
      htmlResponse(
        'https://sp.seg-social.es/ProsaInternet/OnlineAccess',
        '<input id="ARQ.SPM.TICKET" value="t0"/><script id="xml"><ProsaXMLData/></script>',
      ),
    )
  const client: HttpClient = { request, cookie: () => 'S1' }
  await emitUpToDateCertificate(client, '12345678Z', kind, {
    referenceDate: pastLeapDay,
    contractingEntityNif: kind === 'licitacion-fecha' ? 'S2817035E' : undefined,
  })
  const form = request.mock.calls[1]?.[1]?.form ?? {}
  expect(form['certificado']).toBe(code)
  expect(
    Object.fromEntries(
      Object.entries(form).filter(([key]) => /^(?:fecha|nif)/i.test(key)),
    ),
  ).toEqual(expected)
})

it.each(['31/02/2024', '31/12/1979', '01/01/9999', '2024-02-29'])(
  'rejects an invalid reference date %s before contacting TGSS',
  async (referenceDate) => {
    const request = vi.fn<HttpClient['request']>()
    await expect(
      emitUpToDateCertificate(
        { request, cookie: () => undefined },
        '12345678Z',
        'sin-deuda-fecha',
        { referenceDate },
      ),
    ).rejects.toThrow(/--fecha must be a date/)
    expect(request).not.toHaveBeenCalled()
  },
)

it('rejects a reference date on a kind that certifies the current situation', async () => {
  const request = vi.fn<HttpClient['request']>()
  await expect(
    emitUpToDateCertificate(
      { request, cookie: () => undefined },
      '12345678Z',
      'generico',
      { referenceDate: pastLeapDay },
    ),
  ).rejects.toThrow(/does not accept --fecha/)
  expect(request).not.toHaveBeenCalled()
})
