import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { readEmployerAccounts } from './readEmployerAccounts'

vi.mock('../session/loginWithCertificate', () => ({
  loginWithCertificate: vi.fn(),
}))

describe('readEmployerAccounts', () => {
  it('opens RETC0001 and reads the holder and its accounts', async () => {
    const http: HttpClient = { request: vi.fn(), cookie: () => undefined }
    vi.mocked(loginWithCertificate).mockResolvedValue({
      ticket: 't',
      sessionId: 'S1',
      xml:
        '<fila1Dinamica id="FILA1DINAMICA">EMPRESA DE PRUEBA SL - 0B00000000</fila1Dinamica>' +
        '<listaAutorizados><ccc><CC2reg><![CDATA[0111]]></CC2reg><CC3pro><![CDATA[28]]></CC3pro>' +
        '<CC4cod><![CDATA[100000001]]></CC4cod><sit><![CDATA[ALTA]]></sit></ccc></listaAutorizados>',
    })

    const result = await readEmployerAccounts(http)

    expect(loginWithCertificate).toHaveBeenCalledWith(http, 'RETC0001')
    expect(result.titular).toBe('EMPRESA DE PRUEBA SL - 0B00000000')
    expect(result.accounts).toEqual([
      expect.objectContaining({ ccc: '0111 28 100000001', situacion: 'ALTA' }),
    ])
  })
})
