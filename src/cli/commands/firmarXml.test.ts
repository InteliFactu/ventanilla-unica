import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { firmarXml } from './firmarXml'

vi.mock('../../signing/xades/signXmlFile', () => ({
  signXmlFile: vi.fn(async (request: unknown) =>
    Promise.resolve({ signed: request }),
  ),
}))

const request = vi.fn()
const client: HttpClient = { request, cookie: () => undefined }
const identity = { cert: Buffer.alloc(0), key: Buffer.alloc(0) }

describe('firmarXml', () => {
  it('is a local signing command', () => {
    expect(firmarXml).toMatchObject({
      portal: 'firmar',
      action: 'xml',
      effect: 'sign',
      options: ['in', 'modo', 'politica', 'tsa'],
    })
  })

  it('checks the options before the certificate', async () => {
    await expect(firmarXml.run(client, {}, identity)).rejects.toThrow(
      /--in is required/,
    )
    await expect(
      firmarXml.run(client, { in: 'a.xml', out: 'a.xsig' }),
    ).rejects.toThrow(/needs the holder certificate/)
  })

  it('passes the checked request to the signer', async () => {
    await expect(
      firmarXml.run(
        client,
        { in: 'a.xml', out: 'a.xsig', modo: 'detached', politica: 'facturae' },
        identity,
      ),
    ).resolves.toEqual({
      signed: {
        input: 'a.xml',
        output: 'a.xsig',
        mode: 'detached',
        policy: 'facturae',
      },
    })
    expect(request).not.toHaveBeenCalled()
  })
})
